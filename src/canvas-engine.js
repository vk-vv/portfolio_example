/**
 * Instanced Geometric Canvas Engine
 * Renders an instanced 3D isometric prism mesh with directional Lambertian shading.
 * Constraints:
 * - Cap devicePixelRatio at 1.5
 * - No realtime shadows
 * - Respect prefers-reduced-motion
 * - Zero external runtime dependencies
 */

export class InstancedCanvasEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d', { alpha: false });
    this.animationFrameId = null;
    this.isRunning = false;
    this.prefersReducedMotion = false;

    // Viewport dimensions
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    // Camera and animation state
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0.55;
    this.targetRotY = 0.785; // ~45 deg isometric base
    this.currentRotX = 0.55;
    this.currentRotY = 0.785;

    // Colors derived from CSS variables
    this.palette = {
      bg: '#0A3B42',
      accent: '#FFD23F',
      text: '#EAF1F4',
      surface: '#0e444c',
      card: '#0c3e45',
      deep: '#07272c'
    };

    // Shared Unit Cube Geometry (Instanced Topology)
    // 8 vertices for a normalized cuboid
    this.unitVertices = [
      [-1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [-1,  1, -1],
      [-1, -1,  1], [ 1, -1,  1], [ 1,  1,  1], [-1,  1,  1]
    ];

    // 6 Faces defined by vertex indices and normal vectors
    this.faces = [
      { indices: [0, 1, 2, 3], normal: [ 0,  0, -1] }, // Back
      { indices: [4, 5, 6, 7], normal: [ 0,  0,  1] }, // Front
      { indices: [0, 4, 7, 3], normal: [-1,  0,  0] }, // Left
      { indices: [1, 5, 6, 2], normal: [ 1,  0,  0] }, // Right
      { indices: [3, 2, 6, 7], normal: [ 0,  1,  0] }, // Top
      { indices: [0, 1, 5, 4], normal: [ 0, -1,  0] }  // Bottom
    ];

    // Directional light vector (Normalized [0.577, 0.577, -0.577]) - No shadow map overhead
    this.lightDir = [0.577, 0.577, -0.577];

    // Instanced Mesh Data Buffer
    this.instances = [];
    this.initInstances();

    // Event listeners
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMotionPreference = this.handleMotionPreference.bind(this);

    this.initMediaListeners();
    this.handleResize();
  }

  // Generate grid instance buffer
  initInstances() {
    this.instances = [];
    const gridSize = 5;
    const spacing = 2.4;

    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        // Distance from center determines base elevation and phase
        const dist = Math.sqrt(x * x + z * z);
        if (dist > gridSize * 1.1) continue;

        const isAccent = (x === 0 && z === 0) || (Math.abs(x) === 2 && Math.abs(z) === 2);

        this.instances.push({
          x: x * spacing,
          y: 0,
          z: z * spacing,
          baseScaleX: 0.9,
          baseScaleY: isAccent ? 1.4 : 0.8,
          baseScaleZ: 0.9,
          phase: dist * 0.45,
          isAccent: isAccent
        });
      }
    }
  }

  initMediaListeners() {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.renderSingleFrame();
      } else if (this.isRunning) {
        this.start();
      }
    });

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('pointermove', this.handleMouseMove, { passive: true });
  }

  // Handle window resizing with devicePixelRatio capped at 1.5
  handleResize() {
    if (!this.canvas) return;

    // Cap devicePixelRatio at 1.5 to enforce GPU & thermal constraints
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);

    if (this.prefersReducedMotion || !this.isRunning) {
      this.renderSingleFrame();
    }
  }

  // Subtle interactive parallax tilt
  handleMouseMove(event) {
    if (this.prefersReducedMotion) return;
    const nx = (event.clientX / this.width) - 0.5;
    const ny = (event.clientY / this.height) - 0.5;
    this.targetRotY = 0.785 + nx * 0.25;
    this.targetRotX = 0.55 + ny * 0.2;
  }

  // Start animation loop
  start() {
    this.isRunning = true;
    if (this.prefersReducedMotion) {
      this.renderSingleFrame();
      return;
    }

    const tick = () => {
      if (!this.isRunning) return;
      this.time += 0.015;

      // Smooth camera interpolation
      this.currentRotX += (this.targetRotX - this.currentRotX) * 0.05;
      this.currentRotY += (this.targetRotY - this.currentRotY) * 0.05;

      this.renderFrame();
      this.animationFrameId = requestAnimationFrame(tick);
    };

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = requestAnimationFrame(tick);
  }

  // Stop loop cleanly
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Single frame for reduced-motion or static preview
  renderSingleFrame() {
    this.currentRotX = 0.55;
    this.currentRotY = 0.785;
    this.renderFrame();
  }

  // Main render pass
  renderFrame() {
    const ctx = this.ctx;
    if (!ctx) return;

    // Fill background using palette CSS token
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle isometric grid horizon
    const centerX = this.width * 0.65;
    const centerY = this.height * 0.55;
    const zoom = Math.min(this.width, this.height) * 0.045;

    // Camera rotation matrix terms
    const cosX = Math.cos(this.currentRotX);
    const sinX = Math.sin(this.currentRotX);
    const cosY = Math.cos(this.currentRotY);
    const sinY = Math.sin(this.currentRotY);

    // Array to hold transformed polygons for painter's depth sorting
    const renderList = [];

    // Process all mesh instances
    for (let i = 0; i < this.instances.length; i++) {
      const inst = this.instances[i];

      // Dynamic wave elevation (zero computation if reduced-motion)
      const wave = this.prefersReducedMotion ? 0 : Math.sin(this.time * 1.5 + inst.phase) * 0.65;
      const posY = inst.y + wave;
      const scaleY = inst.baseScaleY + (this.prefersReducedMotion ? 0 : Math.abs(wave) * 0.35);

      // Transform 8 instance vertices
      const transformedVerts = [];
      for (let v = 0; v < 8; v++) {
        const u = this.unitVertices[v];
        // Scale and translate
        const lx = inst.x + u[0] * inst.baseScaleX;
        const ly = posY + u[1] * scaleY;
        const lz = inst.z + u[2] * inst.baseScaleZ;

        // Rotate around Y axis
        const rx = lx * cosY - lz * sinY;
        const rz1 = lx * sinY + lz * cosY;

        // Rotate around X axis
        const ry = ly * cosX - rz1 * sinX;
        const rz = ly * sinX + rz1 * cosX;

        // Isometric screen projection
        const screenX = centerX + rx * zoom;
        const screenY = centerY - ry * zoom;

        transformedVerts.push({ x: screenX, y: screenY, z: rz });
      }

      // Transform face normals & calculate directional lighting
      for (let f = 0; f < this.faces.length; f++) {
        const face = this.faces[f];
        const fn = face.normal;

        // Rotate normal
        const nrx = fn[0] * cosY - fn[2] * sinY;
        const nrz1 = fn[0] * sinY + fn[2] * cosY;
        const nry = fn[1] * cosX - nrz1 * sinX;
        const nrz = fn[1] * sinX + nrz1 * cosX;

        // Backface culling: skip faces pointing away from the camera
        if (nrz <= 0) continue;

        // Lambertian directional diffuse lighting (dot product with lightDir)
        // No realtime shadows! Pure mathematical shading
        const dot = Math.max(0, nrx * this.lightDir[0] + nry * this.lightDir[1] + nrz * this.lightDir[2]);
        const lightIntensity = 0.35 + dot * 0.65; // Ambient 0.35 + Direct 0.65

        // Average face depth for painter's sort
        const depth = (
          transformedVerts[face.indices[0]].z +
          transformedVerts[face.indices[1]].z +
          transformedVerts[face.indices[2]].z +
          transformedVerts[face.indices[3]].z
        ) / 4;

        // Resolve face color from tokens
        let faceColor;
        if (inst.isAccent) {
          // Accent gold highlight
          const r = Math.floor(255 * lightIntensity);
          const g = Math.floor(210 * lightIntensity);
          const b = Math.floor(63 * lightIntensity);
          faceColor = `rgb(${r}, ${g}, ${b})`;
        } else {
          // Subtle teal surface gradation
          const r = Math.floor(14 * lightIntensity);
          const g = Math.floor(68 * lightIntensity);
          const b = Math.floor(76 * lightIntensity);
          faceColor = `rgb(${r}, ${g}, ${b})`;
        }

        renderList.push({
          depth: depth,
          isAccent: inst.isAccent,
          color: faceColor,
          points: [
            transformedVerts[face.indices[0]],
            transformedVerts[face.indices[1]],
            transformedVerts[face.indices[2]],
            transformedVerts[face.indices[3]]
          ]
        });
      }
    }

    // Depth sort: back to front (painter's algorithm)
    renderList.sort((a, b) => a.depth - b.depth);

    // Draw sorted polygons
    for (let p = 0; p < renderList.length; p++) {
      const poly = renderList[p];
      ctx.beginPath();
      ctx.moveTo(poly.points[0].x, poly.points[0].y);
      ctx.lineTo(poly.points[1].x, poly.points[1].y);
      ctx.lineTo(poly.points[2].x, poly.points[2].y);
      ctx.lineTo(poly.points[3].x, poly.points[3].y);
      ctx.closePath();

      ctx.fillStyle = poly.color;
      ctx.fill();

      // Clean polygon edge outline
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = poly.isAccent ? 'rgba(255, 210, 63, 0.45)' : 'rgba(234, 241, 244, 0.12)';
      ctx.stroke();
    }
  }

  // Teardown
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('pointermove', this.handleMouseMove);
  }
}


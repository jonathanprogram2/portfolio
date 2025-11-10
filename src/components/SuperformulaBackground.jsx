'use client';

import { useEffect } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



export default function SuperformulaBackground() {
    useEffect(() => {
        /******************
         * Superformula Class *
         ********************/
        class SuperformulaWireframe {
            constructor() {
                // --- presets & themes ---
                this.presets = [
                    { m1: 5, n11: 10, n12: 2, n13: 7, m2: 5, n21: 10, n22: 10, n23: 10 },
                    { m1: 2, n11: 1, n12: 4, n13: 8, m2: 8, n21: 1, n22: 1, n23: 4 },
                    { m1: 6, n11: 1, n12: 1, n13: 1, m2: 3, n21: 1, n22: 5, n23: 1 },
                    { m1: 12, n11: 15, n12: 8, n13: 8, m2: 12, n21: 8, n22: 4, n23: 15 }
                ];

                this.presetOptions = {
                    'Star Crystal': 0,
                    'Ocean Creature': 1,
                    'Spiral Galaxy': 2,
                    'Quantum Form': 3
                };

                this.themes = {
                    Synthwave: {
                        colors: ['#ff1f5a', '#ff758a', '#1e3799', '#0984e3'],
                        burstColor: '#ffffff'
                    },
                    Forest: {
                        colors: ['#38ef7d', '#11998e', '#ffe259', '#ffa751'],
                        burstColor: '#ffff99'
                    },
                    Ocean: {
                        colors: ['#2193b0', '#38ef7d', '#00b4db', '#0083B0'],
                        burstColor: '#8cffff'
                    },
                    Sunset: {
                        colors:['#FF416C', '#FF4B2B', '#f5af19', '#f12711'],
                        burstColor: '#ffffa8'
                    }
                };
                this.themeNames = Object.keys(this.themes);

                this.params = {
                    preset: 0,
                    morphDuration: 2.0,

                    pulseSpeed: 1.0,
                    pulseIntensity: 0.2,
                    microAnimationIntensity: 0.15,
                    colorTheme: 'Sunset',

                    burstSpeed: 0.8,
                    burstDuration: 6.0,
                    multiWave: true,

                    bloomStrength: 1.4,
                    bloomRadius: 0.5,
                    bloomThreshold: 0.18
                };

                this.resolutionTheta = 100;
                this.resolutionPhi = 100;

                this.currentPresetParams = { ...this.presets[this.params.preset] };
                this.targetPresetParams = { ...this.presets[this.params.preset] };
                this.isMorphing = false;
                this.morphStartTime = 0;

                this.burstActive = 0.0;
                this.burstStartTime = -1.0;
                this.lastBurstTime = 0;

                // mouse flags for click vs drag
                this.isMouseDown = false;
                this.isDragging = false;

                // superformula function
                this.superformula = (angle, m, n1, n2, n3, a = 1, b = 1) => {
                    const term1 = Math.pow(Math.abs(Math.cos((m * angle) / 4) / a), n2);
                    const term2 = Math.pow(Math.abs(Math.sin((m * angle) / 4) / b), n3);
                    const sum = term1 + term2;
                    if (sum === 0) return 0;
                    return Math.pow(sum, -1 / n1);
                };

                this.init();
                this.buildCustomPanel();
                this.animate();
            }

            init() {
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                );
                this.camera.position.set(0, 0, 2.5);
                this.camera.lookAt(0, 0, 0);

                this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1.0;

                // Mount into the fixed background container
                this.container = document.getElementById('scene-container');
                if (!this.container) {
                    this.container = document.createElement('div');
                    this.container.id = 'scene-container';
                    Object.assign(this.container.style, {
                        position: 'fixed',
                        inset: '0',
                        width: '100%',
                        height: '100%'
                    });
                    document.body.appendChild(this.container);
                }
                this.container.appendChild(this.renderer.domElement);

                // Postprocessing
                this.composer = new EffectComposer(this.renderer);
                this.composer.addPass(new RenderPass(this.scene, this.camera));

                this.bloomPass = new UnrealBloomPass(
                    new THREE.Vector2(window.innerWidth, window.innerHeight),
                    this.params.bloomStrength,
                    this.params.bloomRadius,
                    this.params.bloomThreshold
                );
                this.composer.addPass(this.bloomPass);

                // Controls
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.autoRotate = false;
                this.controls.minDistance = 1;

                this.clock = new THREE.Clock();

                this.createWireframe();
                this.updateWireframeGeometry();

                // Events
                this._onResize = () => this.onResize();
                window.addEventListener('resize', this._onResize);

                this._onClick = () => {
                    if (!this.isDragging) this.triggerBurst();
                };
                this._onMouseDown = () => {
                    this.isMouseDown = true;
                    this.isDragging = false;
                };
                this._onMouseMove = () => {
                    if (this.isMouseDown) this.isDragging = true;
                };
                this._onMouseUp = () => {
                    this.isMouseDown = false;
                };

                this.container.addEventListener('click', this._onClick);
                this.container.addEventListener('mousedown', this._onMouseDown);
                this.container.addEventListener('mousemove', this._onMouseMove);
                this.container.addEventListener('mouseup', this._onMouseUp);
            }

            triggerBurst() {
                const currentTime = this.clock.getElapsedTime();

                if (currentTime - this.lastBurstTime > 0.3) {
                    this.burstActive = 1.0;
                    this.burstStartTime = currentTime;
                    this.lastBurstTime = currentTime;

                    const burstButton = document.querySelector('.energy-button');
                    if (burstButton) {
                        burstButton.style.boxShadow = '0 0 40px rgba(255, 175, 25, 0.9)';
                        burstButton.style.transform = 'scale(1.15)';

                        const theme = this.themes[this.params.colorTheme];
                        const colors = theme.colors;
                        burstButton.style.background = `linear-gradient(to right, ${colors[0]}, ${colors[2]})`;

                        setTimeout(() => {
                            burstButton.style.boxShadow = '0 0 30px rgba(255, 100, 75, 0.8)';
                            burstButton.style.transform = 'scale(1.1)';
                        }, 150);

                        setTimeout(() => {
                            burstButton.style.boxShadow = '0 0 20px rgba(245, 175, 25, 0.6)';
                            burstButton.style.transform = 'scale(1.05)';
                            burstButton.style.background = `linear-gradient(to right, ${colors[1]}, ${colors[3]})`;
                        }, 300);

                        setTimeout(() => {
                            burstButton.style.boxShadow = '0 8px 20px rgba(255, 75, 43, 0.6)';
                            burstButton.style.transform = '';
                            burstButton.style.background = 
                                'linear-gradient(to right, rgba(255, 65, 108, 0.9), rgba(255, 75, 43, 0.9))'
                        }, 500);
                    }

                    if (this.wireframeMesh) {
                        const theme = this.themes[this.params.colorTheme];
                        const burstColor = theme.burstColor || '#ffffff';

                        this.wireframeMesh.material.uniforms.burstActive.value = this.burstActive;
                        this.wireframeMesh.material.uniforms.burstStartTime.value = this.burstStartTime;
                        this.wireframeMesh.material.uniforms.burstColor.value.set(burstColor);
                    }
                }
            }

            createWireframe() {
                const geometry = new THREE.BufferGeometry();
                const resTheta = this.resolutionTheta;
                const resPhi = this.resolutionPhi;
                const vertexCount = (resTheta + 1) * (resPhi + 1);

                const positions = new Float32Array(vertexCount * 3);
                const colors = new Float32Array(vertexCount * 3);
                const indices = [];

                for (let i = 0; i < resTheta; i++) {
                    for (let j = 0; j < resPhi; j++) {
                        const current = i * (resPhi + 1) + j;
                        const nextTheta = (i + 1) * (resPhi + 1) + j;
                        const nextPhi = current + 1;
                        indices.push(current, nextTheta);
                        indices.push(current, nextPhi);
                    }
                    indices.push(i * (resPhi + 1) + resPhi, (i + 1) * (resPhi + 1) + resPhi);
                }
                const lastRowStart = resTheta * (resPhi + 1);
                for (let j = 0; j < resPhi; j++) {
                    indices.push(lastRowStart + j, lastRowStart + j + 1);
                }

                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));

                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0.0 },
                        pulseSpeed: { value: this.params.pulseSpeed },
                        pulseIntensity: { value: this.params.pulseIntensity },
                        microAnimationIntensity: { value: this.params.microAnimationIntensity },
                        dashSize: { value: 0.1 },
                        dashRatio: { value: 0.5 },
                        burstActive: { value: this.burstActive },
                        burstStartTime: { value: this.burstStartTime },
                        burstSpeed: { value: this.params.burstSpeed },
                        burstDuration: { value: this.params.burstDuration },
                        burstColor: {
                            value: new THREE.Color(this.themes[this.params.colorTheme].burstColor)
                        },
                        multiWave: { value: this.params.multiWave ? 1.0 : 0.0 },
                        morphProgress: { value: 0.0 }
                    },
                    vertexShader: `
                        uniform float time;
                        uniform float pulseSpeed;
                        uniform float pulseIntensity;
                        uniform float microAnimationIntensity;
                        uniform float morphProgress;
                        
                        varying vec3 vColor;
                        varying vec3 vPos;
                        varying float vLineDistance;

                        void main() {
                            vColor = color;
                            vPos = position;

                            vLineDistance = length(position);

                            float pulse = sin(length(position) * 2.0 - time * pulseSpeed) * pulseIntensity;

                            float microAnim1 = sin(position.x * 8.0 + time * 3.0) * microAnimationIntensity;
                            float microAnim2 = cos(position.y * 9.0 + time * 2.7) * microAnimationIntensity;
                            float microAnim3 = sin(position.z * 7.0 + time * 3.3) * microAnimationIntensity;

                            vec3 microOffset = vec3(microAnim1, microAnim2, microAnim3);
                            vec3 pulseOffset = normalize(position) * pulse;

                            microOffset *= (1.0 + morphProgress * 3.0);

                            vec3 animatedPos = position + pulseOffset + microOffset;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(animatedPos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float time;
                        uniform float dashSize;
                        uniform float dashRatio;
                        uniform float burstActive;
                        uniform float burstStartTime;
                        uniform float burstSpeed;
                        uniform float burstDuration;
                        uniform vec3 burstColor;
                        uniform float multiWave;

                        varying vec3 vColor;
                        varying vec3 vPos;
                        varying float vLineDistance;

                        void main() {
                            vec3 finalColor = vColor;
                            float finalIntensity = 1.0;

                            float totalSize = dashSize * (1.0 + dashRatio);
                            float patternPos = mod(vLineDistance + time * 0.2, totalSize);
                            float dashPart = step(patternPos, dashSize);

                            if (dashPart < 0.1) {
                                discard;
                            }

                            finalIntensity *= (1.0 + dashPart * 0.5);

                            if (burstActive > 0.5) {
                                float burstElapsed = max(0.0, time - burstStartTime);
                                if (burstElapsed < burstDuration) {
                                    float distOrigin = length(vPos);
                                    float progress = burstElapsed / burstDuration;

                                    float baseSpeed = burstSpeed;
                                    float mainRadius = burstElapsed * baseSpeed;
                                    float mainThickness = 0.4 * (1.0 - 0.5 * progress);

                                    float mainDist = abs(distOrigin - mainRadius);
                                    float mainWave = 1.0 - smoothstep(0.0, mainThickness, mainDist);

                                    float trailFactor = smoothstep(0.0, mainRadius, distOrigin) * (1.0 - smoothstep(mainRadius * 0.5, mainRadius, distOrigin));

                                    float secondaryWave = 0.0;
                                    float tertiaryWave = 0.0;

                                    if (multiWave > 0.5) {
                                        float secondaryRadius = burstElapsed * (baseSpeed * 1.5);
                                        float secondaryThickness = 0.3 * (1.0 - 0.6 * progress);
                                        float secondaryDist = abs(distOrigin - secondaryRadius);
                                        secondaryWave = 1.0 - smoothstep(0.0, secondaryThickness, secondaryDist);
                                        secondaryWave *= 0.7 * (1.0 - progress * 0.7);

                                        float tertiaryRadius = burstElapsed * (baseSpeed * 0.7);
                                        float tertiaryThickness = 0.25 * (1.0 - 0.4 * progress);
                                        float tertiaryDist = abs(distOrigin - tertiaryRadius);
                                        tertiaryWave = 1.0 - smoothstep(0.0, tertiaryThickness, tertiaryDist);
                                        tertiaryWave *= 0.5 * (1.0 - progress * 0.5);
                                    }
                                    
                                    vec3 waveColorShift = burstColor;
                                    if (secondaryWave > 0.01) {
                                        waveColorShift = mix(burstColor, vec3(0.5, 0.8, 1.0), 0.3);
                                    }
                                    if (tertiaryWave > 0.01) {
                                        waveColorShift = mix(burstColor, vec3(0.8, 0.5, 1.0), 0.3);
                                    }

                                    float combinedWave = max(max(mainWave, secondaryWave * 0.8), tertiaryWave * 0.6);
                                    combinedWave = max(combinedWave, trailFactor * 0.4);

                                    float timeFade = 1.0 - smoothstep(burstDuration * 0.6, burstDuration, burstElapsed);
                                    combinedWave *= timeFade;
                                    
                                    finalColor = mix(finalColor, waveColorShift, combinedWave * 0.8);
                                    finalIntensity += combinedWave * 3.0;

                                    float rippleFactor = sin(distOrigin * 10.0 - burstElapsed * 5.0) * 0.5 + 0.5;
                                    rippleFactor *= smoothstep(0.0, mainRadius * 0.8, distOrigin) * (1.0 - smoothstep(mainRadius * 0.8, mainRadius, distOrigin));
                                    rippleFactor *= 0.15 * timeFade;

                                    finalIntensity += rippleFactor;   
                                }
                            }
                            
                            gl_FragColor = vec4(finalColor * finalIntensity, 1.0);
                        }
                    `,
                    vertexColors: true,
                    transparent: true
                });

                this.wireframeMesh = new THREE.LineSegments(geometry, material);
                this.scene.add(this.wireframeMesh);
            }

            updateWireframeGeometry() {
                if (!this.wireframeMesh) return;

                const geometry = this.wireframeMesh.geometry;
                const positions = geometry.attributes.position.array;
                const colors = geometry.attributes.color.array;

                const sfParams = this.isMorphing
                    ? this.getInterpolatedParams()
                    : this.currentPresetParams;
                
                const resTheta = this.resolutionTheta;
                const resPhi = this.resolutionPhi;

                const theme = this.themes[this.params.colorTheme];
                const themeColors = theme.colors.map((c) => new THREE.Color(c));

                let vertexIndex = 0;
                for (let i = 0; i <= resTheta; i++) {
                    const theta = THREE.MathUtils.mapLinear(i, 0, resTheta, -Math.PI / 2, Math.PI / 2);
                    const r1 = this.superformula(theta, sfParams.m1, sfParams.n11, sfParams.n12, sfParams.n13);

                    for (let j = 0; j <= resPhi; j++) {
                        const phi = THREE.MathUtils.mapLinear(j, 0, resPhi, -Math.PI, Math.PI);
                        const r2 = this.superformula(phi, sfParams.m2, sfParams.n21, sfParams.n22, sfParams.n23);

                        const x = r1 * Math.cos(theta) * r2 * Math.cos(phi);
                        const y = r1 * Math.sin(theta);
                        const z = r1 * Math.cos(theta) * r2 * Math.sin(phi);

                        positions[vertexIndex * 3 + 0] = x;
                        positions[vertexIndex * 3 + 1] = y;
                        positions[vertexIndex * 3 + 2] = z;

                        const colorMix = THREE.MathUtils.smoothstep(y, -1.5, 1.5);
                        const colorIndex1 = Math.floor(colorMix * (themeColors.length - 1));
                        const colorIndex2 = Math.min(colorIndex1 + 1, themeColors.length - 1);
                        const colorFraction = colorMix * (themeColors.length - 1) - colorIndex1;

                        const vertexColor = themeColors[colorIndex1].clone().lerp(
                            themeColors[colorIndex2],
                            colorFraction
                        );

                        colors[vertexIndex * 3 + 0] = vertexColor.r;
                        colors[vertexIndex * 3 + 1] = vertexColor.g;
                        colors[vertexIndex * 3 + 2] = vertexColor.b;

                        vertexIndex++;
                    }
                }

                geometry.attributes.position.needsUpdate = true;
                geometry.attributes.color.needsUpdate = true;
                geometry.computeBoundingSphere();
            }

            getInterpolatedParams() {
                const duration = Math.max(0.001, this.params.morphDuration);
                const elapsedTime = this.clock.getElapsedTime() - this.morphStartTime;
                const totalProgress = Math.min(1.0, elapsedTime / duration);

                if (this.wireframeMesh && this.wireframeMesh.material.uniforms.morphProgress) {
                    const morphEffect = Math.sin(totalProgress * Math.PI);
                    this.wireframeMesh.material.uniforms.morphProgress.value = morphEffect;
                }

                const interpolated = {};
                for (const key in this.currentPresetParams) {
                    const factor = Math.sin((totalProgress * Math.PI) / 2);
                    interpolated[key] = THREE.MathUtils.lerp(
                        this.currentPresetParams[key],
                        this.targetPresetParams[key],
                        factor
                    );
                }
                return interpolated;
            }

            startMorphing(targetPresetIndex) {
                const targetIndex = Number(targetPresetIndex);
                if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= this.presets.length) {
                    console.error('Invalid target preset index:', targetPresetIndex);
                    return;
                }

                if (!this.isMorphing) {
                    this.currentPresetParams = { ...this.presets[this.params.preset] };
                } else {
                    this.currentPresetParams = this.getInterpolatedParams();
                }

                this.params.preset = targetIndex;
                this.targetPresetParams = {...this.presets[targetIndex] };

                this.isMorphing = true;
                this.morphStartTime = this.clock.getElapsedTime();
            }


            /* =======================
                New bottom control dock
            ========================== */
            buildCustomPanel() {
                // create panel
                const el = document.createElement('div');
                el.id = 'sf-panel';

                const isMobile = window.innerWidth <= 900;


                if (isMobile) {
                    // ----------------- MOBILE: bottom nav with drop-up panels -------------
                    el.innerHTML = `
                        <div class="sf-mobile-root">
                            <!-- Try Me label -->
                            <div class="sf-mobile-try">
                                <span class="ping"></span>
                                <span> ✨ Try me!</span>
                            </div>

                            <!-- bottom nav bar -->
                            <div class="sf-mobile-bar">
                                <div class="sf-mobile-tabs">
                                    <button class="sf-mobile-tab" data-target="shape">
                                        Shape &amp; Morphing
                                    </button>
                                    <button class="sf-mobile-tab" data-target="anim">
                                        Animation &amp; Color
                                    </button>
                                    <button class="sf-mobile-tab" data-target="bloom">
                                        Bloom Effect
                                    </button>
                                </div>

                                <!-- Energy Burst moved into the bar -->
                                <button class="sf-burst sf-mobile-bar energy-button" id="sf-burst" type="button">
                                    ✨ Energy Burst
                                </button>
                            </div>

                            <!-- drop up: Shape & Morphing -->
                            <div class="sf-mobile-panel sf-mobile-panel--hidden" id="sf-panel-shape">
                                <div class="sf-mobile-panel-inner">
                                    <div class="sf-row">
                                        <div class="sf-label">Shape Preset</div>
                                        <select class="sf-select" id="sf-preset">
                                            <option value="0">Star Crystal</option>
                                            <option value="1">Ocean Creature</option>
                                            <option value="2">Spiral Galaxy</option>
                                            <option value="3">Quantum Form</option>
                                        </select>
                                    </div>

                                    <div class="sf-row">
                                        <div class="sf-label">Morph Duration</div>
                                        <div class="sf-range-wrap">
                                            <input class="sf-range" id="sf-morph" type="range" min="0.5" max="5" step="0.1" value="${this.params.morphDuration}">
                                            <div class="sf-val" id="sf-morph-val">${this.params.morphDuration.toFixed(1)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- drop up: Animation & Color -->
                            <div class="sf-mobile-panel sf-mobile-panel--hidden" id="sf-panel-anim">
                                <div class="sf-mobile-panel-inner">
                                    <div class="sf-row">
                                        <div class="sf-label">Pulse Speed</div>
                                        <div class="sf-range-wrap">
                                            <input class="sf-range" id="sf-ps" type="range" min="0" max="2" step="0.05" value="${this.params.pulseSpeed}">
                                            <div class="sf-val" id="sf-ps-val">${this.params.pulseSpeed.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div class="sf-row">
                                        <div class="sf-label">Pulse Intensity</div>
                                        <div class="sf-range-wrap">
                                            <input class="sf-range" id="sf-pi" type="range" min="0" max="0.5" step="0.01" value="${this.params.pulseIntensity}">
                                            <div class="sf-val" id="sf-pi-val">${this.params.pulseIntensity.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div class="sf-row">
                                        <div class="sf-label">Micro Animations</div>
                                        <div class="sf-range-wrap">
                                            <input class="sf-range" id="sf-ma" type="range" min="0" max="0.3" step="0.01" value="${this.params.microAnimationIntensity}">
                                            <div class="sf-val" id="sf-ma-val">${this.params.microAnimationIntensity.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div class="sf-row">
                                        <div class="sf-label">Color Theme</div>
                                        <select class="sf-select" id="sf-theme">
                                            ${this.themeNames
                                                .map(
                                                    (name) =>
                                                        `<option value="${name}" ${
                                                            name === this.params.colorTheme ? "selected" : ""
                                                        }>${name}</option>`
                                                )
                                                .join("")}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- drop-up: Bloom Effect -->
                            <div class="sf-mobile-panel sf-mobile-panel--hidden" id="sf-panel-bloom">
                                <div class="sf-mobile-panel-inner">
                                    <div class="sf-row">
                                        <div class="sf-label">Strength</div>
                                        <div class="sf-range-wrap">
                                            <input class="sf-range" id="sf-bs" type="range" min="0" max="3" step="0.05" value="${this.params.bloomStrength}">
                                            <div class="sf-val" id="sf-bs-val">${this.params.bloomStrength.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div class="sf-row">
                                        <div class="sf-label">Radius</div>
                                        <div class="sf-range-wrap">
                                            <input class="sf-range" id="sf-br" type="range" min="0" max="2" step="0.05" value="${this.params.bloomRadius}">
                                            <div class="sf-val" id="sf-br-val">${this.params.bloomRadius.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div class="sf-row">
                                        <div class="sf-label">Threshold</div>
                                        <div class="sf-range-wrap">
                                            <input class="sf-range" id="sf-bt" type="range" min="0" max="1" step="0.01" value="${this.params.bloomThreshold}">
                                            <div class="sf-val" id="sf-bt-val">${this.params.bloomThreshold.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div class="sf-row">
                                        <div class="sf-label">Multi-Wave Effect</div>
                                        <label class="sf-toggle" style="display:flex;align-items:center;gap:8px;background:transparent;border:none;padding:0;">
                                            <input id="sf-mw" type="checkbox" ${this.params.multiWave ? "checked" : ""} />
                                            <span>Enabled</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // ----- DESKTOP version -------
                    el.innerHTML = `
                        <div class="sf-head">
                            <div class="sf-title">
                                <span class="ping"></span>
                                <span> ✨ Try me!</span>
                            </div>
                            <div class="sf-head-actions">
                                <button class="sf-burst energy-button" id="sf-burst" type="button">
                                    ✨ ENERGY BURST
                                </button>
                            </div>
                        </div>

                        <div class="sf-grid">
                            <!-- SHAPE -->
                            <div class="sf-card">
                                <h4>Shape & Morphing</h4>

                                <div class="sf-row">
                                    <div class="sf-label">Shape Preset</div>
                                    <select class="sf-select" id="sf-preset">
                                        <option value="0">Star Crystal</option>
                                        <option value="1">Ocean Creature</option>
                                        <option value="2">Spiral Galaxy</option>
                                        <option value="3">Quantum Form</option>
                                    </select>
                                </div>

                                <div class="sf-row">
                                    <div class="sf-label">Morph Duration</div>
                                    <div class="sf-range-wrap">
                                        <input class="sf-range" id="sf-morph" type="range" min="0.5" max="5" step="0.1" value="${this.params.morphDuration}">
                                        <div class="sf-val" id="sf-morph-val">${this.params.morphDuration.toFixed(1)}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- ANIMATION -->
                            <div class="sf-card">
                                <h4>Animation & Color</h4>

                                <div class="sf-row">
                                    <div class="sf-label">Pulse Speed</div>
                                    <div class="sf-range-wrap">
                                        <input class="sf-range" id="sf-ps" type="range" min="0" max="2" step="0.05" value="${this.params.pulseSpeed}">
                                        <div class="sf-val" id="sf-ps-val">${this.params.pulseSpeed.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div class="sf-row">
                                    <div class="sf-label">Pulse Intensity</div>
                                    <div class="sf-range-wrap">
                                        <input class="sf-range" id="sf-pi" type="range" min="0" max="0.5" step="0.01" value="${this.params.pulseIntensity}">
                                        <div class="sf-val" id="sf-pi-val">${this.params.pulseIntensity.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div class="sf-row">
                                    <div class="sf-label">Micro-Animations</div>
                                    <div class="sf-range-wrap">
                                        <input class="sf-range" id="sf-ma" type="range" min="0" max="0.3" step="0.01" value="${this.params.microAnimationIntensity}">
                                        <div class="sf-val" id="sf-ma-val">${this.params.microAnimationIntensity.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div class="sf-row">
                                    <div class="sf-label">Color Theme</div>
                                    <select class="sf-select" id="sf-theme">
                                        ${this.themeNames.map(name => `<option value="${name}" ${name===this.params.colorTheme?'selected':''}>${name}</option>`).join('')}
                                    </select>
                                </div>
                            </div>

                            <!-- BLOOM -->
                            <div class="sf-card">
                                <h4>Bloom Effect</h4>

                                <div class="sf-row">
                                    <div class="sf-label">Strength</div>
                                    <div class="sf-range-wrap">
                                        <input class="sf-range" id="sf-bs" type="range" min="0" max="3" step="0.05" value="${this.params.bloomStrength}">
                                        <div class="sf-val" id="sf-bs-val">${this.params.bloomStrength.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div class="sf-row">
                                    <div class="sf-label">Radius</div>
                                    <div class="sf-range-wrap">
                                        <input class="sf-range" id="sf-br" type="range" min="0" max="2" step="0.05" value="${this.params.bloomRadius}">
                                        <div class="sf-val" id="sf-br-val">${this.params.bloomRadius.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div class="sf-row">
                                    <div class="sf-label">Threshold</div>
                                    <div class="sf-range-wrap">
                                        <input class="sf-range" id="sf-bt" type="range" min="0" max="1" step="0.01" value="${this.params.bloomThreshold}">
                                        <div class="sf-val" id="sf-bt-val">${this.params.bloomThreshold.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div class="sf-row">
                                    <div class="sf-label">Multi-Wave Effect</div>
                                    <label class="sf-toggle" style="display:flex;align-items:center;gap:8px; background:transparent; border:none; padding:0;">
                                        <input id="sf-mw" type="checkbox" ${this.params.multiWave ? 'checked' : ''} />
                                        <span>Enabled</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    `;
                }

                const hero =
                    document.querySelector('[data-anchor="home"]') ||
                    document.querySelector('#home') ||
                    document.querySelector('.fp-section') ||
                    document.querySelector('.section');

                const heroSection = hero || document.body;

                if (isMobile) {
                    heroSection.appendChild(el);
                } else {
                    heroSection.appendChild(el);
                }
               
                this._panel = el;

                /* ------- Mobile tab toggling -------*/
                if (isMobile) {
                    const tabs = el.querySelectorAll(".sf-mobile-tab");
                    const panels = {
                        shape: el.querySelector("#sf-panel-shape"),
                        anim: el.querySelector("#sf-panel-anim"),
                        bloom: el.querySelector("#sf-panel-bloom"),
                    };

                    let openKey = null;

                    const closeAllPanels = () => {
                        openKey = null;
                        tabs.forEach((t) => t.classList.remove("sf-mobile-tab--active"));
                        Object.values(panels).forEach((p) => {
                            if (!p) return;
                            p.classList.add("sf-mobile-panel--hidden");
                        });
                    };

                    tabs.forEach((tab) => {
                        tab.addEventListener("click", (e) => {
                            e.stopPropagation();
                            const target = tab.dataset.target;

                            // if this tab is already open -> close it
                            if (openKey === target) {
                                closeAllPanels();
                                return;
                            }

                            // otherwise open this one and close others
                            openKey = target;
                            tabs.forEach((t) =>
                                t.classList.toggle("sf-mobile-tab--active", t === tab)
                            );
                            Object.entries(panels).forEach(([key, p]) => {
                                if (!p) return;
                                p.classList.toggle(
                                    "sf-mobile-panel--hidden",
                                    key !== target
                                );
                            });
                        });
                    });

                    // Click outside to close
                    const root = el.querySelector(".sf-mobile-root");
                    this._mobileOutsideHandler = (evt) => {
                        if (root && !root.contains(evt.target)) {
                            closeAllPanels();
                        }
                    };
                    document.addEventListener("click", this._mobileOutsideHandler);
                }

                // shared wiring for sliders / selects
                const qs = (sel) => el.querySelector(sel);

                const presetSel = qs("#sf-preset");
                if (presetSel) {
                    presetSel.addEventListener("change", (e) => {
                        this.startMorphing(parseInt(e.target.value, 10));
                    });
                }

                const linkRange = (id, valId, setter) => {
                    const input = qs(id);
                    const val = qs(valId);
                    if (!input || !val) return;
                    const update = () => {
                        const num = Number(input.value);
                        const decimals = input.step && input.step.includes(".") ? 2 : 0;
                        val.textContent = num.toFixed(decimals);
                        setter(num);
                    };
                    input.addEventListener("input", update);
                    update();
                };

                linkRange("#sf-morph", "#sf-morph-val", (v) => { this.params.morphDuration = v; });
                linkRange("#sf-ps", "#sf-ps-val", (v) => {
                    this.params.pulseSpeed = v;
                    if (this.wireframeMesh) this.wireframeMesh.material.uniforms.pulseSpeed.value = v;
                });
                linkRange("#sf-pi", "#sf-pi-val", (v) => {
                    this.params.pulseIntensity = v;
                    if (this.wireframeMesh) this.wireframeMesh.material.uniforms.pulseIntensity.value = v;
                });
                linkRange("#sf-ma", "#sf-ma-val", (v) => {
                    this.params.microAnimationIntensity = v;
                    if (this.wireframeMesh) this.wireframeMesh.material.uniforms.microAnimationIntensity.value = v;
                });

                const themeSel = qs("#sf-theme");
                if (themeSel) {
                    themeSel.addEventListener("change", (e) => {
                        this.params.colorTheme = e.target.value;
                        this.updateWireframeGeometry();
                        if (this.wireframeMesh?.material?.uniforms?.burstColor) {
                            const themeColor = 
                                this.themes[this.params.colorTheme].burstColor || '#ffffff';
                            this.wireframeMesh.material.uniforms.burstColor.value.set(
                                themeColor
                            );
                        }
                    });
                }

                linkRange("#sf-bs", "#sf-bs-val", (v) => { this.params.bloomStrength = v; this.bloomPass.strength = v; });
                linkRange("#sf-br", "#sf-br-val", (v) => { this.params.bloomRadius = v; this.bloomPass.radius = v; });
                linkRange("#sf-bt", "#sf-bt-val", (v) => { this.params.bloomThreshold = v; this.bloomPass.threshold = v; });

                const mwToggle = qs("#sf-mw");
                if (mwToggle) {
                    mwToggle.addEventListener("change", (e) => {
                        this.params.multiWave = !!e.target.checked;
                        if (this.wireframeMesh) 
                            this.wireframeMesh.material.uniforms.multiWave.value = 
                                this.params.multiWave ? 1.0 : 0.0;
                    });
                }

                const burstBtn = qs("#sf-burst");
                if (burstBtn) {
                    burstBtn.addEventListener("click", () => this.triggerBurst())
                }
            }

            removeCustomPanel() {
                if (this._panel && this._panel.parentNode) this._panel.parentNode.removeChild(this._panel);
                this._panel = null;
            }

            animate() {
                this._raf = requestAnimationFrame(() => this.animate());
                const elapsedTime = this.clock.getElapsedTime();
                const delta = this.clock.getDelta();

                if (this.isMorphing) {
                    const morphProgress =
                        (elapsedTime - this.morphStartTime) / Math.max(0.001, this.params.morphDuration);
                    if (morphProgress >= 1.0) {
                        this.isMorphing = false;
                        this.currentPresetParams = { ...this.targetPresetParams };
                        this.updateWireframeGeometry();
                        if (this.guiPresetController) this.guiPresetController.updateDisplay();
                    } else {
                        this.updateWireframeGeometry();
                    }
                }
                if (this.wireframeMesh && this.wireframeMesh.material.uniforms) {
                    this.wireframeMesh.material.uniforms.time.value = elapsedTime;
                    this.wireframeMesh.material.uniforms.burstActive.value = this.burstActive;
                    this.wireframeMesh.material.uniforms.burstStartTime.value = this.burstStartTime;

                    if (
                        this.burstActive > 0.5 &&
                        elapsedTime - this.burstStartTime >= this.params.burstDuration
                    ) {
                        this.burstActive = 0.0;
                        this.burstStartTime = -1.0;
                    }
                }

                this.controls.update(delta);
                this.composer.render();
            }

            onResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.composer.setSize(window.innerWidth, window.innerHeight);
            }

            // basic cleanup for unmount
            dispose() {
                cancelAnimationFrame(this._raf);
                window.removeEventListener('resize', this._onResize);
                if (this.container) {
                    this.container.removeEventListener('click', this._onClick);
                    this.container.removeEventListener('mousedown', this._onMouseDown);
                    this.container.removeEventListener('mousemove', this._onMouseMove);
                    this.container.removeEventListener('mouseup', this._onMouseUp);
                }

                if (this._mobileOutsideHandler) {
                    document.removeEventListener("click", this._mobileOutsideHandler);
                    this._mobileOutsideHandler = null;
                }
                
                this.removeCustomPanel();

                if (this.wireframeMesh) {
                    this.wireframeMesh.geometry.dispose();
                    this.wireframeMesh.material.dispose();
                    this.scene.remove(this.wireframeMesh);
                }
                this.renderer.dispose();
                const canvas = this.renderer.domElement;
                if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            }
        }

        // Instantiate & keep a reference for cleanup
        const app = new SuperformulaWireframe();

        return () => app.dispose();
    }, []);

    return null; // It draws into #scene-container
} 
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// This is a complex GLSL shader that generates fractal noise
const CloudMaterial = shaderMaterial(
  // Uniforms: These are the values we pass from React.
  // We MUST declare gtexture here.
  {
    uTime: 0,
    uColor: new THREE.Color('white'),
    uOpacity: 1.0,
    gtexture: null, // Placeholder for our noise texture
  },
  // Vertex Shader (passes UV coordinates to the fragment shader)
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (where the visual magic happens)
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform sampler2D gtexture; // --- THIS LINE IS THE CRITICAL FIX ---
    varying vec2 vUv;

    // A standard function for creating Fractal Brownian Motion (FBM) noise
    float fbm(vec2 p) {
        float f = 0.0;
        // The mat2 is a simple 2D rotation matrix
        mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
        
        // This process adds multiple layers ("octaves") of noise at different scales
        // to create a more detailed, "fractal" look.
        f += 0.5000 * texture2D(gtexture, p).r; p = m * p * 2.02;
        f += 0.2500 * texture2D(gtexture, p).r; p = m * p * 2.03;
        f += 0.1250 * texture2D(gtexture, p).r; p = m * p * 2.01;
        f += 0.0625 * texture2D(gtexture, p).r;
        f /= 0.9375; // Normalize the result
        return f;
    }

    void main() {
        // Center the UV coordinates so (0,0) is in the middle
        vec2 p = vUv - 0.5;
        // Animate the noise by shifting its coordinates over time
        vec2 q = p - vec2(0.0, uTime * 0.03);

        // Calculate the noise value for this pixel
        float noise = fbm(q * 3.0);
        
        // Use smoothstep to turn the smooth noise gradient into hard-edged cloud shapes
        float cloudShape = smoothstep(0.4, 0.7, noise);

        // Fade the cloud towards the edges of the plane to avoid harsh square borders
        float edgeFade = 1.0 - length(p * 1.5);
        
        // Combine all factors to get the final transparency
        float finalAlpha = cloudShape * edgeFade * uOpacity;

        // Output the final color and transparency
        gl_FragColor = vec4(uColor, finalAlpha);
    }
  `,
  // This is a special initializer function for the material.
  // It runs once when the material is created.
  (self) => {
    // We load the noise texture and assign it to the 'gtexture' uniform.
    self.gtexture = new THREE.TextureLoader().load('/noise.png');
    self.gtexture.wrapS = self.gtexture.wrapT = THREE.RepeatWrapping;
  }
)

export default CloudMaterial;
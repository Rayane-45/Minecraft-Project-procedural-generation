// https://www.quora.com/How-does-Minecraft-generate-worlds
// https://r105.threejsfundamentals.org/threejs/lessons/threejs-voxel-geometry.html

import * as THREE from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { TextureLoader, Vector2, Vector3 } from 'three'
import { makeNoise2D } from "open-simplex-noise";
import Block from './block';


export default class Scene extends THREE.Scene
{
    chunks: Block[][] = []
    chunk: Block[] = []

    chunkSize = 16

    noise2D = makeNoise2D(Date.now()); // Using current date as seed

    xOffset = 0;
    zOffset = 0;

    skybox = new THREE.Mesh()
    geometry = new THREE.BoxBufferGeometry(1,1,1)
    grassTexture = new THREE.MeshStandardMaterial

    isTerrainInit = false

    async initialize()
    {
        this.background = new THREE.Color('blue')

        const textureLoader = new THREE.TextureLoader()

        // Skybox
        let materialArray = [];
        let texture_ft = new THREE.TextureLoader().load( '../assets/textures/skyFront.jpg');
        let texture_bk = new THREE.TextureLoader().load( '../assets/textures/skyBack.jpg');
        let texture_up = new THREE.TextureLoader().load( '../assets/textures/skyTop.jpg');
        texture_up.rotation = Math.PI;
        texture_up.center = new Vector2(0.5, 0.5); // center of texture.
        let texture_dn = new THREE.TextureLoader().load( '../assets/textures/skyBottom.jpg');
        texture_dn.rotation = Math.PI;
        texture_dn.center = new Vector2(0.5, 0.5); // center of texture.
        let texture_rt = new THREE.TextureLoader().load( '../assets/textures/skyRight.jpg');
        let texture_lf = new THREE.TextureLoader().load( '../assets/textures/skyLeft.jpg');
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt, fog: false }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf, fog: false }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up, fog: false }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn, fog: false }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk, fog: false }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft, fog: false }));


        for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide; 

        let skyboxGeo = new THREE.BoxGeometry( 100, 100, 100);
        this.skybox = new THREE.Mesh( skyboxGeo, materialArray );
        this.add( this.skybox );
 
        // World Generation

        this.grassTexture = new THREE.MeshStandardMaterial({
            map: textureLoader.load("../assets/textures/grass.png")
        })
        
        const fullGrassTexture=[]
        for(var i =0; i<6;i++){
            fullGrassTexture.push(this.grassTexture)
        }

        const sandTexture=[
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/sand.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/sand.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/sand.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/sand.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/sand.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/sand.png")
            }),
        ]
        const stoneTexture=[
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/stone.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/stone.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/stone.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/stone.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/stone.png")
            }),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load("../assets/textures/stone.png")
            }),
        ]

        for(let n = 0; n <= 9; n++){ // first chunks init

            this.generateChunk(this.xOffset, this.zOffset, this.grassTexture)
        }

        console.log(this.chunks)

        for(let i=0; i<this.chunks.length;i++){
            for(let j=0; j<this.chunks[i].length;j++){

            const block = this.chunks[i][j].add(this.chunks, this.chunkSize, this.xOffset, this.zOffset)
            this.add(block)
        }

        const light =  new THREE.DirectionalLight(0xFFFFFF, 1.25/9)
        light.position.set(0, this.chunkSize, 0)

        const light1 =  new THREE.DirectionalLight(0xFFFFFF, 1/9)
        light1.position.set(-this.chunkSize/2, 0, 0)

        const light2 =  new THREE.DirectionalLight(0xFFFFFF, 0.5/9)
        light2.position.set(this.chunkSize/2, 0, 0)

        const light3 =  new THREE.DirectionalLight(0xFFFFFF, 0.75/9)
        light3.position.set(0, 0, this.chunkSize/2)

        const light4 =  new THREE.DirectionalLight(0xFFFFFF, 0.75/9)
        light4.position.set(0, 0, -this.chunkSize/2)

        this.add(light)
        this.add(light1)
        this.add(light2)
        this.add(light3)
        this.add(light4)

        const helper = new THREE.DirectionalLightHelper( light, 5 );
        //this.add( helper );
        const helper1 = new THREE.DirectionalLightHelper( light1, 5 );
        //this.add( helper1 );
        const helper2 = new THREE.DirectionalLightHelper( light2, 5 );
        //this.add( helper2 );
        const helper3 = new THREE.DirectionalLightHelper( light3, 5 );
        //this.add( helper3 );
        const helper4 = new THREE.DirectionalLightHelper( light4, 5 );
        //this.add( helper4 );

        this.isTerrainInit = true
    }
}

    generateChunk(xOffset: number, zOffset: number, _texture: THREE.MeshStandardMaterial){

        const fullTexture=[]
        for(var i =0; i<6;i++){
            fullTexture.push(_texture)
        }

        for (let z = -this.chunkSize/2 + this.zOffset/2; z < this.chunkSize/2 + this.zOffset/2; z++) {
                
            for (let y = -this.chunkSize/2; y < this.chunkSize/2; y++) {

                for (let x = -this.chunkSize/2 + this.xOffset; x < this.chunkSize/2 + this.xOffset; x++) {

                    const height = this.noise2D( (x)/20, (z)/20) * 10 // 30 = amplitude = height;  100 = frequency

                    if(y <= height){
            
                        const block_obj = new Block(x, y, z, this.geometry, fullTexture)
                        this.chunk.push(block_obj)
                    }
                }
            }
        }

        this.chunks.push(this.chunk) 

        if(this.isTerrainInit == true){

            for(let i=0; i<this.chunks.length;i++){
    
                const block = this.chunk[i].add(this.chunks, this.chunkSize, this.xOffset, this.zOffset)
                this.add(block)
            }
        }

        this.xOffset += this.chunkSize
        //this.zOffset += chunkSize

        this.chunk = []
    }

    highestXBlock(chunks: Block[][]){
        var x_array = []
        for(let i=0; i<chunks.length;i++){
            for(let j=0; j<chunks[i].length;j++){

                x_array.push(chunks[i][j].getX())
            }
        }
        return Math.max(...x_array)
    }
    lowestXBlock(chunks: Block[][]){
        var x_array = []
        for(let i=0; i<chunks.length;i++){
            for(let j=0; j<chunks[i].length;j++){

                x_array.push(chunks[i][j].getX())
            }
        }
        return Math.min(...x_array)
    }
    highestZBlock(chunks: Block[][]){
        var z_array = []
        for(let i=0; i<chunks.length;i++){
            for(let j=0; j<chunks[i].length;j++){

                z_array.push(chunks[i][j].getZ())
            }
        }
        return Math.max(...z_array)
    }
    lowestZBlock(chunks: Block[][]){
        var z_array = []
        for(let i=0; i<chunks.length;i++){
            for(let j=0; j<chunks[i].length;j++){

                z_array.push(chunks[i][j].getZ())
            }
        }
        return Math.min(...z_array)
    }

    async update(camera_position: Vector3,){

        if(this.isTerrainInit == true){

            const lowestX = this.lowestXBlock(this.chunks)
            const lowestZ = this.lowestZBlock(this.chunks)
            const highestX = this.highestXBlock(this.chunks)
            const highestZ = this.highestZBlock(this.chunks)

            if(camera_position.x <= lowestX + 1){
                console.log("lowest X")
                this.xOffset = lowestX - this.chunkSize
                this.zOffset = 0
                console.log(this.xOffset)
                console.log(this.zOffset)
                this.generateChunk(lowestX - this.chunkSize, 0, this.grassTexture)
            }
            else if(camera_position.x >= highestX - 1){

                console.log("highest X")
            }
            else if(camera_position.z <= lowestZ + 1){

                console.log("lowest Z")
            }
            else if(camera_position.z >= highestZ - 1){

                console.log("highest Z")
            }

            this.skybox.position.set(camera_position.x, camera_position.y, camera_position.z,)
        }
    }


}
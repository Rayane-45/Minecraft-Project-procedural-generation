import { Scene3D } from "enable3d";
import * as THREE from 'three'
import {TextureLoader, Vector2, Vector3 } from 'three'
import { floorPowerOfTwo } from "three/src/math/MathUtils";
import Scene from './Scene'

export default class Block
{
    x: number;
    y: number;
    z: number;
    geometry: THREE.BoxBufferGeometry;
    texture: THREE.MeshStandardMaterial[];
    directions : any = []; // voisins
    faces: any = [
        {
            dir: [-1,0,0, "left"] 
        },
        {
            dir: [1,0,0, "right"]
        },
        {
            dir: [0,-1,0, "bottom"]
        },
        {
            dir: [0,1,0, "top"]
        },
        {
            dir: [0,0,1, "back"]
        },
        {
            dir: [0,0,-1, "front"]
        },
    ];

    constructor(_x: number,_y: number, _z: number, _geometry: THREE.BoxBufferGeometry, _texture: THREE.MeshStandardMaterial[]) {
        this.x=_x
        this.y=_y
        this.z=_z
        this.geometry = _geometry
        this.texture = _texture
    }

    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getZ(){
        return this.z;
    }

    add(chunks: Block[][], chunkSize:number, xOffset:number, zOffset:number){

        this.adjustFaces(chunks, chunkSize, xOffset, zOffset)
      
        const cube = new THREE.Mesh(this.geometry, [
            (this.directions.includes("right") ? null! : this.texture[0]),
            (this.directions.includes("left") ? null! : this.texture[1]),
            (this.directions.includes("top") ? null! : this.texture[2]),
            (this.directions.includes("bottom") ? null! : this.texture[3]),
            (this.directions.includes("front") ? null! : this.texture[4]),
            (this.directions.includes("back") ? null! : this.texture[5]),
        ])

        cube.position.x = this.x
        cube.position.y = this.y
        cube.position.z = -this.z

        return cube
    }

    adjustFaces(chunks: Block[][], chunkSize:number,  xOffset:number, zOffset:number){

      for (const {dir} of this.faces){

        const neighbour = this.getVoxel(this.x+dir[0], this.y+dir[1], this.z+dir[2], chunks, chunkSize, xOffset, zOffset)
        if(neighbour){
            switch(dir[3]){
                case "right":
                    this.directions.push("right")
                    break
                case "left":
                    this.directions.push("left")
                    break
                case "bottom":
                    this.directions.push("bottom")
                    break
                case "top":
                    this.directions.push("top")
                    break
                case "back":
                    this.directions.push("back")
                    break
                case "front":
                    this.directions.push("front")
                    break        
            }
        }
      }
    }

    getVoxel(x:number, y:number, z:number, chunks: Block[][], chunkSize:number, xOffset:number, zOffset:number){
       
        for(var i =0; i<chunks.length;i++){
            for(var j =0; j < chunks[i].length;j++){

                if(y < -chunkSize/2){ // Afficher le dessous de la map est inutile

                    return true
                }
                if(x < -chunkSize/2 - chunkSize*1 || z < -chunkSize/2 - chunkSize*0 || x >= chunkSize/2 + chunkSize*9 || z >= chunkSize/2 + chunkSize*0){ // Afficher les cotés de la map est inutile
    
                    return true
                }
                
                if(chunks[i][j].getX() == x && chunks[i][j].getY() == y && chunks[i][j].getZ() == z){

                    return true
                }
            }
        }

        return false
    }
}
import * as THREE from 'http://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js'


class BasicWorld {
    constructor () {
        this._textureName = 'arch';
        this._Initialize();
    }

    _Initialize() {
        this._threejs=new THREE.WebGLRenderer();
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    
        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov=60;
        const aspect = 1920/1080;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        this._camera.position.set(75, 20, 0);
        
        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(100, 100, 100);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias=-0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = -200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = -200;
        this._scene.add(light);

        light = new THREE.AmbientLight(0x404040);
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        
        this.updateAddress();
        

        this._RAF();
    }

    updateAddress() {
        var _address = `./sources/` + this._textureName + `/` + this._textureName;
        const loader = new THREE.CubeTextureLoader();
        const texture =  loader.load([
            _address + '_ft.png',
            _address + '_bk.png',
            _address + '_up.png',
            _address + '_dn.png',
            _address + '_rt.png',
            _address + '_lf.png',      
        ]);
        // var aa = `./emfki.jpg`;
        // const texture = loader.load([
        //     aa, `./emfki.jpg`, `./emfki.jpg`, `./emfki.jpg`, `./emfki.jpg`, `./emfki.jpg`
        // ]);
            // './sources/arch3_bk.png',
            // './sources/arch3_dn.png',
            // './sources/arch3_ft.png',
            // './sources/arch3_lf.png',
            // './sources/arch3_rt.png',
            // './sources/arch3_up.png'
        this._scene.background=texture;
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth/window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame(() => {
            this._threejs.render(this._scene, this._camera);
            this._RAF();
        });
    }
}

let go = null;
window.addEventListener('DOMContentLoaded', ()=>{
    go = new BasicWorld();
});


//propogating a list of scenes to ask from user
var viewsList = ['arch', 'cave', 'dark', 'hot', 'rainbow', 'sh', 'skyast', 'skyhsky', 'skype', 'sp1', 'sp2', 'tron', 'local', 'fvr', 'umer'];

//creating a container for select list
var parentEl = document.createElement('div');
parentEl.style.position = "fixed";
parentEl.style.top = "0px";
parentEl.style.right = "5%";
parentEl.style.userSelect = "none";
parentEl.style.padding = "5px";
parentEl.innerHTML = "Select other from Scenes"
parentEl.style.background = "rgba(151, 151, 151, 0.2)";
parentEl.onmouseover = ()=> {
    parentEl.getElementsByTagName('ul')[0].style.display = "block";
    parentEl.style.cursor = "pointer";
};

parentEl.onmouseout = ()=> {
    parentEl.getElementsByTagName('ul')[0].style.display = "none";
}

document.body.appendChild(parentEl);

let select = document.createElement('ul');
select.id = "select";
select.style.display = "none";
select.style.background = "transparent";
select.style.margin = "5px";
parentEl.appendChild(select);

for(var i =0; i<viewsList.length; i++)
{
    var li = document.createElement('li');
    li.innerHTML = viewsList[i];
    li.style.display = "block";
    li.style.padding = "5px";
    select.appendChild(li);
    console.log(viewsList[i]+'\n'); 
}

document.body.addEventListener("mouseover", (e)=>{
    e = e || window.event;
    var targetEl = e.target || e.srcElement;
        if(targetEl.nodeName=='LI')
        {
            targetEl.style.fontWeight = "900";
        }  
});

document.body.addEventListener("mouseout", (e)=>{
    e = e || window.event;
    var targetEl = e.target || e.srcElement;
        if(targetEl.nodeName=='LI')
        {
            targetEl.style.fontWeight = "100";
        }  
});

document.body.addEventListener("click", (e)=>{
    e = e || window.event;
    var targetEl = e.target || e.srcElement;
        if(targetEl.nodeName=='LI')
        {
            go._textureName=targetEl.innerHTML;
            go.updateAddress();           
        }  
});

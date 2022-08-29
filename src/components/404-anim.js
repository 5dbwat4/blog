async function init404Animation(parentDOM){

    const THREE=await import("./lib/three/three.module")

	const OrbitControls=(await import('./lib/three/OrbitControls.js')).OrbitControls;

    let controls
    let camera, scene, renderer;
    let plane;
    let pointer, raycaster, isShiftDown = false;

    let rollOverMesh, rollOverMaterial;
    let cubeGeo, cubeMaterials;

    const objects = [];

    init();
    render();

    function init() {

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 50, 80, 130 );
        camera.lookAt( 0, 0, 0 );

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );



        // roll-over helpers

        const rollOverGeo = new THREE.BoxGeometry( 5, 5, 5 );
        rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
        rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
        scene.add( rollOverMesh );

        // cubes

        cubeGeo = new THREE.BoxGeometry( 5, 5, 5 );
        cubeMaterials = [
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/bedrock.png'                      ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/brick.png'                        ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/coal_ore.png'                     ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/cobblestone.png'                  ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/emerald_block.png'                ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/emerald_ore.png'                  ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/gold_block.png'                   ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/gold_ore.png'                     ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/gravel.png'                       ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/ice_packed.png'                   ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/iron_block.png'                   ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/iron_ore.png'                     ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/lapis_ore.png'                    ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/purpur_block.png'                 ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/redstone_ore.png'                 ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/soul_sand.png'                    ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/stone.png'                        ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/stonebrick.png'                   ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/stone_andesite.png'               ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/stone_andesite_smooth.png'        ) } ),
            new THREE.MeshLambertMaterial( {  map: new THREE.TextureLoader().load( './assets/textures/wool_colored_white.png'           ) } ),

    ]
        // grid

        const gridHelper = new THREE.GridHelper( 1000, 200 );
        scene.add( gridHelper );

        //

        raycaster = new THREE.Raycaster();
        pointer = new THREE.Vector2();

        const geometry = new THREE.PlaneGeometry( 1000, 1000 );
        geometry.rotateX( - Math.PI / 2 );

        plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
        scene.add( plane );

        objects.push( plane );

        // lights

        const ambientLight = new THREE.AmbientLight( 0x606060 );
        scene.add( ambientLight );

        const directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
        scene.add( directionalLight );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

                        // Controls

                        controls = new OrbitControls( camera, renderer.domElement );
        controls.listenToKeyEvents( window ); // optional
        controls.panSpeed=0.2
        controls.rotateSpeed=0.2

        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

        // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        // controls.dampingFactor = 0.05;

        // controls.screenSpacePanning = false;

        // controls.minDistance = 100;
        // controls.maxDistance = 500;

        // controls.maxPolarAngle = Math.PI / 2;

        document.addEventListener( 'pointermove', onPointerMove );
        document.addEventListener( 'pointerdown', onPointerDown );
        document.addEventListener( 'keydown', onDocumentKeyDown );
        document.addEventListener( 'keyup', onDocumentKeyUp );

        //

        window.addEventListener( 'resize', onWindowResize );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

    }

    function onPointerMove( event ) {

        pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

        raycaster.setFromCamera( pointer, camera );

        const intersects = raycaster.intersectObjects( objects, false );

        if ( intersects.length > 0 ) {

            const intersect = intersects[ 0 ];

            rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
            rollOverMesh.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );

        }

        render();

    }

    function onPointerDown( event ) {

        pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

        raycaster.setFromCamera( pointer, camera );

        const intersects = raycaster.intersectObjects( objects, false );

        if ( intersects.length > 0 ) {

            const intersect = intersects[ 0 ];

            // delete cube

            if ( isShiftDown ) {

                if ( intersect.object !== plane ) {

                    scene.remove( intersect.object );

                    objects.splice( objects.indexOf( intersect.object ), 1 );

                }

                // create cube

            } else {

                let vid=Math.round(Math.random()*cubeMaterials.length)
                console.log(vid);
                const voxel = new THREE.Mesh( cubeGeo, cubeMaterials[vid] );
                voxel.position.copy( intersect.point ).add( intersect.face.normal );
                voxel.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );
                scene.add( voxel );

                objects.push( voxel );

            }

            render();

        }

    }

    function onDocumentKeyDown( event ) {

        switch ( event.keyCode ) {

            case 16: isShiftDown = true; break;

        }

    }

    function onDocumentKeyUp( event ) {

        switch ( event.keyCode ) {

            case 16: isShiftDown = false; break;

        }

    }

    function render() {

        renderer.render( scene, camera );

    }
}

export{init404Animation}
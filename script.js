require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/widgets/Legend',
    "esri/rest/support/Query",
], function (Map, SceneView, FeatureLayer, GraphicsLayer, Legend, Query) {


    const map = new Map({
        basemap: "topo-vector",
    });




    const view = new SceneView({
        map: map,
        center: [12.482778, 41.893056],
        zoom: 4,
        container: "map",

    });

    // Warstwa
    const earthQuake1 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0",
        title: "Trzęsienia ziemi 1"
    }); // dla trzesien powyzej 4 stopni


    const earthQuake2 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0",
        title: "Trzęsienia ziemi"
    }); // wartswa 3D





    map.add(earthQuake2);

    let g1 = new GraphicsLayer();

    map.add(g1);
    const query = earthQuake1.createQuery();

    query.where = "MAGNITUDE > 4";
    query.outFields = ["*"];
    query.returnGeometry = true;

    earthQuake1.queryFeatures(query)
        .then(response => {
            console.log(response);
            getResults(response.features);
        })
        .catch(err => {
            console.log(err);
        });


    const getResults = (features) => {
        const symbol = {
            type: 'simple-marker',
            size: 15,
            color: "yellow",
            style: "triangle"
        };

        features.map(elem => {
            elem.symbol = symbol;
        });

        g1.addMany(features)
    };

    const simple = {
        type: "simple",
        symbol: {
            type: "point-3d",
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        primitive: "cylinder"
                    },
                    width: 5000
                }
            ]
        },

        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0.5,
                        color: "green"
                    },
                    {
                        value: 4,
                        color: "red"
                    }
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [{
                    value: -3.39,
                    size: 50000
                },
                {
                    value: 30.97,
                    size: 120000
                },
                ]
            }
        ]
    };


    earthQuake2.renderer = simple;

    const legend = new Legend({
        view: view
    });

    view.ui.add(legend, { position: "bottom-right" })







});

window.CensusMap = {

    map: null,

    currentLevel: null,

    currentData: null,

    currentIndicator: null,

    initialize() {

        mapboxgl.accessToken =
            APP_CONFIG.MAPBOX_TOKEN;

        this.map =
            new mapboxgl.Map({

                container: "map",

                style:
                    "mapbox://styles/mapbox/standard",

                center:
                    APP_CONFIG.INITIAL_CENTER,

                zoom:
                    APP_CONFIG.INITIAL_ZOOM

            });

        this.map.addControl(
            new mapboxgl.NavigationControl(),
            "top-left"
        );

        this.map.on(
            "load",
            () => {

                console.log(
                    "Mapbox map loaded."
                );

            }
        );

    },

    async showLevel(
        level,
        indicator
    ) {

        const data =
            await CensusData.loadGeoJSON(
                level
            );

        this.currentLevel = level;
        this.currentData = data;
        this.currentIndicator = indicator;

        this.removeLayers();

        this.map.addSource(
            "census",
            {
                type: "geojson",
                data: data
            }
        );

        this.map.addLayer({

            id: "census-fill",

            type: "fill",

            source: "census",

            paint: {

                "fill-color":
                    this.colorExpression(
                        indicator
                    ),

                "fill-opacity": 0.65,

                "fill-outline-color":
                    "#ffffff"

            }

        });

        this.map.addLayer({

            id: "census-outline",

            type: "line",

            source: "census",

            paint: {

                "line-color":
                    "#4b5563",

                "line-width": 0.8,

                "line-opacity": 0.65

            }

        });

        this.attachInteractions();

    },

    colorExpression(
        indicator
    ) {

        const field =
            indicator.field;

        return [
            "interpolate",
            ["linear"],
            [
                "coalesce",
                ["to-number", ["get", field]],
                0
            ],

            0,
            "#f7fbff",

            10,
            "#deebf7",

            25,
            "#c6dbef",

            40,
            "#9ecae1",

            60,
            "#6baed6",

            80,
            "#3182bd",

            100,
            "#08519c"
        ];

    },

    attachInteractions() {

        this.map.on(
            "click",
            "census-fill",
            event => {

                const feature =
                    event.features[0];

                if (!feature) {
                    return;
                }

                window.CensusUI
                    .showFeature(
                        feature
                    );

            }
        );

        this.map.on(
            "mouseenter",
            "census-fill",
            () => {

                this.map.getCanvas()
                    .style.cursor =
                    "pointer";

            }
        );

        this.map.on(
            "mouseleave",
            "census-fill",
            () => {

                this.map.getCanvas()
                    .style.cursor =
                    "";

            }
        );

    },

    removeLayers() {

        if (!this.map) {
            return;
        }

        if (
            this.map.getLayer(
                "census-fill"
            )
        ) {
            this.map.removeLayer(
                "census-fill"
            );
        }

        if (
            this.map.getLayer(
                "census-outline"
            )
        ) {
            this.map.removeLayer(
                "census-outline"
            );
        }

        if (
            this.map.getSource(
                "census"
            )
        ) {
            this.map.removeSource(
                "census"
            );
        }

    }

};
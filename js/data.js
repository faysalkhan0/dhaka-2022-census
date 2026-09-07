window.CensusData = {

    cache: {},

    async loadGeoJSON(level) {

        if (this.cache[level]) {
            return this.cache[level];
        }

        const url =
            `${APP_CONFIG.DATA_PATH}${level}.geojson`;

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Could not load ${level}.geojson`
            );
        }

        const data =
            await response.json();

        this.cache[level] = data;

        return data;
    },

    async loadIndicators() {

        if (this.cache.indicators) {
            return this.cache.indicators;
        }

        const response =
            await fetch(
                `${APP_CONFIG.METADATA_PATH}indicators.json`
            );

        if (!response.ok) {
            throw new Error(
                "Could not load indicators.json"
            );
        }

        const data =
            await response.json();

        this.cache.indicators = data;

        return data;
    },

    async loadHierarchy() {

        if (this.cache.hierarchy) {
            return this.cache.hierarchy;
        }

        const response =
            await fetch(
                `${APP_CONFIG.METADATA_PATH}hierarchy.json`
            );

        if (!response.ok) {
            throw new Error(
                "Could not load hierarchy.json"
            );
        }

        const data =
            await response.json();

        this.cache.hierarchy = data;

        return data;
    }

};
window.CensusHierarchy = {

    async getChildren(
        parentCode,
        childLevel
    ) {

        const data =
            await CensusData.loadGeoJSON(
                childLevel
            );

        return data.features.filter(
            feature =>
                feature.properties
                    .PARENT_GEO_CODE
                    === parentCode
        );

    },

    getParentPath(feature) {

        const p =
            feature.properties;

        return p.ADMIN_PATH || "";

    },

    getName(feature) {

        const p =
            feature.properties;

        return (
            p.location_name ||
            p.LOCATION_NAME ||
            p.NAME ||
            p.name ||
            "Unnamed area"
        );

    },

    getCode(feature) {

        const p =
            feature.properties;

        return (
            p.GEO_CODE ||
            p.geo_code ||
            ""
        );

    }

};
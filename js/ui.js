window.CensusUI = {

    indicators: {},

    initialize() {

        this.bindControls();

    },

    async loadIndicators() {

        this.indicators =
            await CensusData
                .loadIndicators();

        const select =
            document.getElementById(
                "indicatorSelect"
            );

        select.innerHTML = "";

        for (
            const [key, indicator]
            of Object.entries(
                this.indicators
            )
        ) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = key;

            option.textContent =
                indicator.label ||
                key;

            select.appendChild(
                option
            );

        }

    },

    bindControls() {

        document
            .getElementById(
                "levelSelect"
            )
            .addEventListener(
                "change",
                () => this.refresh()
            );

        document
            .getElementById(
                "indicatorSelect"
            )
            .addEventListener(
                "change",
                () => this.refresh()
            );

        document
            .getElementById(
                "resetButton"
            )
            .addEventListener(
                "click",
                () => {

                    CensusMap.map
                        .flyTo({

                            center:
                                APP_CONFIG
                                    .INITIAL_CENTER,

                            zoom:
                                APP_CONFIG
                                    .INITIAL_ZOOM

                        });

                }
            );

    },

    async refresh() {

        const level =
            document
                .getElementById(
                    "levelSelect"
                )
                .value;

        const key =
            document
                .getElementById(
                    "indicatorSelect"
                )
                .value;

        const indicator =
            this.indicators[key];

        if (!indicator) {
            return;
        }

        await CensusMap
            .showLevel(
                level,
                indicator
            );

        this.updateLegend(
            indicator
        );

    },

    showFeature(feature) {

        const p =
            feature.properties;

        const name =
            CensusHierarchy
                .getName(feature);

        const code =
            CensusHierarchy
                .getCode(feature);

        const path =
            CensusHierarchy
                .getParentPath(
                    feature
                );

        document
            .getElementById(
                "locationInfo"
            )
            .innerHTML = `

                <strong>
                    ${this.escape(name)}
                </strong>

                <br>

                <span>
                    Code: ${this.escape(code)}
                </span>

                <br>

                <span>
                    ${this.escape(path)}
                </span>

            `;

        const key =
            document
                .getElementById(
                    "indicatorSelect"
                )
                .value;

        const indicator =
            this.indicators[key];

        const raw =
            p[indicator.field];

        if (
            raw === null ||
            raw === undefined ||
            raw === ""
        ) {

            document
                .getElementById(
                    "statValue"
                )
                .textContent =
                "No data";

        } else {

            document
                .getElementById(
                    "statValue"
                )
                .textContent =
                this.formatValue(
                    raw,
                    indicator
                );

        }

        document
            .getElementById(
                "statLabel"
            )
            .textContent =
            indicator.label;

    },

    formatValue(
        value,
        indicator
    ) {

        const number =
            Number(value);

        if (
            Number.isNaN(number)
        ) {
            return value;
        }

        if (
            indicator.format ===
            "percent"
        ) {

            return (
                number.toFixed(1) +
                "%"
            );

        }

        return new Intl.NumberFormat()
            .format(number);

    },

    updateLegend(
        indicator
    ) {

        document
            .getElementById(
                "legend"
            )
            .innerHTML = `

                <strong>
                    ${this.escape(
                        indicator.label
                    )}
                </strong>

                <div>
                    Low
                    <span>
                        ░░░░░░░
                    </span>
                    High
                </div>

            `;

    },

    escape(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }

};
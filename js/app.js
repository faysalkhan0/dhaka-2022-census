(async function () {

    try {

        CensusMap.initialize();

        CensusUI.initialize();

        await CensusUI
            .loadIndicators();

        await new Promise(
            resolve => {

                if (
                    CensusMap.map
                        .loaded()
                ) {

                    resolve();

                } else {

                    CensusMap.map.once(
                        "load",
                        resolve
                    );

                }

            }
        );

        await CensusUI.refresh();

        console.log(
            "Dhaka Census Explorer ready."
        );

    } catch (error) {

        console.error(error);

        document.body.innerHTML += `

            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                padding: 14px;
                background: #fee2e2;
                color: #991b1b;
                border: 1px solid #fecaca;
                border-radius: 8px;
                z-index: 9999;
            ">

                <strong>
                    Application error
                </strong>

                <br>

                ${error.message}

            </div>

        `;

    }

})();
const nodeFetch = require("node-fetch");
const cookieFetchWrapper = require('fetch-cookie');
const mergeDeepRight = require('ramda/src/mergeDeepRight');

const { CookieJar } = cookieFetchWrapper.toughCookie;
const cookieJar = new CookieJar();
const fetchFn = cookieFetchWrapper(nodeFetch, cookieJar);

const fetch = (api = '', opts = {}) => {
    const { data } = opts;
    delete opts.data;

    const options = mergeDeepRight({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data || {}),
    }, opts);

    return fetchFn(`https://www.notion.so/api/v3/${api}`, options)
        .then(res => res.json())
        .then(res => {
            // 接口报错
            if(res.errorId) {
                throw new Error(`${api} ${res.name} ${res.message}`);
            }
            return res;
        })
};

const login = (email, password) => {
    return fetch('loginWithEmail', {
        data: {
            email,
            password,
        },
    })
}

const launchExportSpaceTask = (spaceId, exportType) => {
    return fetch('enqueueTask', {
        data: {
            "task": {
                "eventName": "exportSpace",
                "recursive": false,
                "request": {
                    spaceId,
                    "exportOptions": {
                        exportType,
                        "timeZone": "Asia/Shanghai",
                        "locale": "en",
                    },
                },
            }
        },
    })
}

const launchExportBlockTask = (spaceId, blockId, exportType) => {
    return fetch(`enqueueTask`, {
        data: {
            "task":{"eventName":"exportBlock","request":{"block":{"id":"07e03492-9491-45ec-b3b8-ccb1421d47a8","spaceId":"16c447c6-c832-49fa-96ea-bd0fe947716d"},"recursive":false,"exportOptions":{"exportType":"markdown","timeZone":"Asia/Shanghai","locale":"en"}}}
            // "task": {
            //     "eventName": "exportBlock",
            //     "request": {
            //         "block": {
            //             "spaceId": spaceId,
            //             "id": blockId,
            //         },
            //         "recursive": false,
            //         "exportOptions": {
            //             exportType,
            //             "timeZone": "Asia/Shanghai",
            //             "locale": "en",
            //         }
            //     }
            // },
        },
    });
}

const getUserTaskStatus = (taskId) => {
    return fetch('getTasks', {
        data: {
            taskIds: [taskId],
        }
    })
        .then(res => {
            const targetResult = res?.results?.[0] || {};
            if(targetResult.state === 'failure') {
                throw new Error(`getTasks error: ${targetResult.error}`);
            }

            return targetResult;
        })
}

module.exports = {
    login,
    launchExportSpaceTask,
    launchExportBlockTask,
    getUserTaskStatus,
}
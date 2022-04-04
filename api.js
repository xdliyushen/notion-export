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

    // todo 修改
    return fetchFn(`http://localhost:8000/${api}`, options)
    // return fetchFn(`https://www.notion.so/api/v3/${api}`, options)
        .then(res => res.json());
};

const login = (email, password) => {
    return fetch('loginWithEmail', {
        data: {
            email,
            password,
        },
    });
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
            "task": {
                "eventName": "exportBlock",
                "request": {
                    "block": {
                        "spaceId": spaceId,
                        "id": blockId,
                    },
                    "recursive": true,
                    "exportOptions": {
                        exportType,
                        "timeZone": "Asia/Shanghai",
                        "locale": "en",
                        "includeContents": "everything"
                    }
                }
            },
        },
    });
}

const getUserTaskStatus = (taskId) => {
    return fetch('getTasks', {
        data: {
            taskIds: [taskId],
        }
    })
        .then(res => res?.results?.[0])
}

module.exports = {
    login,
    launchExportSpaceTask,
    launchExportBlockTask,
    getUserTaskStatus,
}
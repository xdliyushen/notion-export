const nodeFetch = require('node-fetch');
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
            if (res.errorId) {
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

const getSpaces = () => {
    return fetch('getSpaces')
        .then(res => {
            const key = Object.keys(res)[0];
            const spaceId = Object.keys(res[key].space)[0];

            return spaceId;
        })
}

const launchExportTask = (spaceId, blockId, exportType) => {
    const eventName = blockId ? 'exportBlock' : 'exportSpace';
    const requestOpts = blockId ? {
        block: { spaceId, id: blockId },
        exportOptions: exportType === 'markdown' ? {} : { exportType },
    } : {
        spaceId,
        exportOptions: exportType === 'markdown' ? {} : { exportType },
    }

    return fetch('enqueueTask', {
        data: {
            task: {
                eventName,
                request: mergeDeepRight({
                    recursive: false,
                    exportOptions: {
                        exportType,
                        timeZone: 'Asia/Shanghai',
                        locale: 'en',
                    },
                }, requestOpts),
            }
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
            if (targetResult.state === 'failure') {
                throw new Error(`getTasks error: ${targetResult.error}`);
            }

            return targetResult;
        })
}

module.exports = {
    login,
    getSpaces,
    launchExportTask,
    getUserTaskStatus,
}
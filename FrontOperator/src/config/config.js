if (!__buildEnv__) {
    __buildEnv__ = 'dev';
}

const {
    PROTOCOL,
    HOST,
    PORT,
    BOXPROTOCOL,
    BOXHOST,
    BOXPORT
} = require(`./config.${__buildEnv__}`);
export const basicConfig = {
    SHOW_IMG_HOST: `${PROTOCOL}//file.${HOST}${PORT}/api/fileserver/show/pub?fileName=`,
    UPLOAD_IMG_HOST: `${PROTOCOL}//file.${HOST}${PORT}/api/fileserver/upload/pub`,
    SHOW_PRI_IMG_HOST: `${PROTOCOL}//file.${HOST}${PORT}/api/fileserver/show/pri?fileName=`,
    UPLOAD_PRI_IMG_HOST: `${PROTOCOL}//file.${HOST}${PORT}/api/fileserver/upload/pri`,
    BASEDATA_HOST: `${PROTOCOL}//management.${HOST}${PORT}/api`,
    PRODUCT_HOST: `${PROTOCOL}//operator.${HOST}${PORT}/api`,
    USER_HOST: `${PROTOCOL}//user.${HOST}${PORT}/api`,
    COOKIES_DOMAIN:`${HOST}`
}

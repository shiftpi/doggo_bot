// Pseudo abstract class
class ImageApi {
    getRandom() {
        return null;
    }

    getCredits() {
        return null;
    }

    getPicType() {
        return ImageApi.PicType;
    }
}

ImageApi.PicType = Object.freeze({ pic: 1, gif: 2 });

module.exports =  ImageApi;
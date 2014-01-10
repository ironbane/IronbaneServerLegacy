// a set of common widgets and such
angular.module('IBCommon', ['ngSanitize'])
// this borrowed from three.js "Detector"
.constant('FeatureDetection', {
    canvas: !! window.CanvasRenderingContext2D,
    webgl: ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
    workers: !! window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob
});
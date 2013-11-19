define(function(){

    // cross browser compatibility
    navigator.getUserMedia  = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia

    var hd = {
        mandatory: {
            minWidth: 1280,
            minHeight: 720
        }
    }
    , vga = {
        mandatory: {
            maxWidth: 640,
            maxHeight: 360
        }
    }

    function getVideo( el, video ){
        return el.querySelector( 'video'  ) || ( video  = document.createElement( 'video' ))  && (video.autoplay = true)         && el.appendChild(video) && video
    }

    function getCanvas( el, canvas ){
        return el.querySelector( 'canvas' ) || ( canvas = document.createElement( 'canvas' )) && (canvas.style.display = 'none') && el.appendChild(canvas) && canvas
    }

    function getImage( el, image ){
        return el.querySelector( 'image'  ) || ( image  = document.createElement( 'img' ))  && (image.src = '')                && el.appendChild(image) && image
    }

    function cpt( id, opts ){
        var el     = id && document.querySelector( id ) || document.body
        , video    = getVideo( el )
        , canvas   = getCanvas( el )
        , snapshot = getImage( el )
        , ctx      = canvas.getContext( '2d' )
        , mstream  = null

        opts = ( opts === 'hd' && hd ) || ( opts === 'vga' && vga ) || true


        navigator.getUserMedia({ video: opts }, function( stream ){
            video.src = window.URL.createObjectURL( stream )
            mstream   = stream
        })

        function Capture(){ this.snapshot() }

        Capture.prototype.snapshot = function(){
            if ( !mstream ) return
            ctx.drawImage( video, 0, 0 )
            snapshot.src = canvas.toDataURL('image/webp')
        }

        Capture.prototype.stream = function(){
            return mstream
        }

        var capture = new Capture()

        video.addEventListener( 'click', capture.snapshot.bind(capture), false )

        return el['data-capture'] = capture
    }


    return cpt

})
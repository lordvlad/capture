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
        return el.querySelector( 'video' ) || ( video = document.createElement( 'video' )) && (video.autoplay = true)  && el.appendChild(video) && video
    }

    function getCanvas( el, canvas ){
        return el.querySelector( 'canvas' ) || ( canvas = document.createElement( 'canvas' )) && (canvas.style.display = 'none') && el.appendChild(canvas) && canvas
    }

    function getImage( el, image ){
        return el.querySelector( 'image' ) || ( image = document.createElement( 'image' )) && (image.src = '') && el.appendChild(image) && image
    }


    function Capture( id, opts ){
        var el     = id && document.querySelector( id ) || document.body
        , video    = getVideo( el )
        , canvas   = getCanvas( el )
        , ctx      = canvas.getContext( '2d' )
        , snapshot = getImage( el )
        , mstream  = null

        opts = ( opts === 'hd' && hd ) || ( opts === 'vga' && vga ) || true

        video.addEventListener( 'click', this.snapshot.bind(this), false )

        navigator.getUserMedia({ video: opts }, function( stream ){
            video.src = window.URL.createObjectURL( stream )
            mstream   = stream
        })

        el['data-capture'] = this

    }

    Capture.snapshot = function(){
        if ( !stream ) return
        ctx.drawImage( video, 0, 0 )
        snapshot.src = canvas.toDataURL('image/webp')
    }


    return Capture

})
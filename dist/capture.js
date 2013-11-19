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

    function getImage( el, img ){
        console.log( el )
        return el.querySelector( 'img'  )   || ( img  = document.createElement( 'img' ))      && (img.src = '')                  || el.appendChild(img)    && img
    }

    function getVideo( el, video ){
        return el.querySelector( 'video'  ) || ( video  = document.createElement( 'video' ))  && (video.autoplay = true)         && el.appendChild(video)  && video
    }

    function getCanvas( el, canvas ){
        return el.querySelector( 'canvas' ) || ( canvas = document.createElement( 'canvas' )) && (canvas.style.display = 'none') && el.appendChild(canvas) && canvas
    }

    /**
     * if opts.image === null, don't use a preview image
     */

    function cpt( id, opts ){
        var el     = id && document.querySelector( id ) || document.body
        , img      = opts ? (opts.image===null ? null : ( opts.image && document.querySelector( opts.image ) || getImage( el ))) : getImage( el )
        , video    = opts && opts.video && document.querySelector( opts.video ) || getVideo( el )
        , canvas   = getCanvas( el )
        , ctx      = canvas.getContext( '2d' )
        , mstream  = null

        console.log(img, video, canvas)
        opts = opts || {}
        opts.quality = opts.quality || ( opts === 'hd' && hd ) || ( opts === 'vga' && vga ) || vga


        function Capture(){ this.snapshot() }

        Capture.prototype.startStream = function(){
            navigator.getUserMedia({ video: opts.quality }, function( stream ){
                video.src = window.URL.createObjectURL( stream )
                mstream   = stream
                el.dispatchEvent( new CustomEvent( 'capture.stream.started', { detail : stream }))
            })
        }


        Capture.prototype.snapshot = function(){
            if ( !mstream ) return
            ctx.drawImage( video, 0, 0 )
            var dataurl = canvas.toDataURL('image/webp')
            img.src = dataurl
            el.dispatchEvent( new CustomEvent( 'capture.snapshot.taken', { detail : dataurl }))
        }

        Capture.prototype.stream = function(){
            return mstream
        }

        var capture = new Capture()

        el.addEventListener( 'capture.snapshot.take', capture.snapshot.bind(capture), false )
        el.addEventListener( 'capture.stream.start', capture.streamStart.bind(capture), false )
        el.addEventListener( 'capture.stream.stop', function(){ mstream && mstram.stop && mstream.stop() }, false )

        return el['data-capture'] = capture
    }


    return cpt

})
(function(){
  function ready(fn){ if(document.readyState!=='loading'){ fn() } else { document.addEventListener('DOMContentLoaded', fn) } }

  ready(function(){
    // Cover image lightbox handlers
    var coverImage = document.getElementById('cover-image')
    var coverImageMobile = document.getElementById('cover-image-mobile')
    var lightbox = document.getElementById('cover-lightbox')
    var lightboxImage = document.getElementById('cover-lightbox-image')
    var closeBtn = document.getElementById('cover-lightbox-close')

    function setupLightbox(img){
      if (!img || !lightbox) return
      img.addEventListener('click', function(){
        var url = img.getAttribute('data-lightbox-url') || img.getAttribute('src')
        if (url && lightboxImage) lightboxImage.src = url
        lightbox.classList.remove('hidden')
        document.body.style.overflow = 'hidden'
      })
    }
    function closeLightbox(){
      if (!lightbox) return
      lightbox.classList.add('hidden')
      document.body.style.overflow = ''
    }
    setupLightbox(coverImage)
    setupLightbox(coverImageMobile)
    closeBtn && closeBtn.addEventListener('click', closeLightbox)
    lightboxImage && lightboxImage.addEventListener('click', closeLightbox)
    lightbox && lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox() })
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) closeLightbox() })

    // Instagram share handlers
    var shareBtn = document.getElementById('share-to-ig')
    if(!shareBtn) return

    var articleId = shareBtn.getAttribute('data-article-id') || ''
    var ogVersion = shareBtn.getAttribute('data-ogv') || 'v1'

    var igModal = document.getElementById('ig-share-modal')
    var igClose = document.getElementById('ig-modal-close')
    var igPreview = document.getElementById('ig-preview')
    var igDownload = document.getElementById('ig-download')
    var igLoading = document.getElementById('ig-loading')

    var storyUrl = '/api/og/story/' + encodeURIComponent(articleId) + '?v=' + encodeURIComponent(ogVersion)
    var lastObjectUrl = ''
    var lastBlob = null

    function ga(event, params){
      try { if (window.gtag) window.gtag('event', event, params || {}) } catch(_e) {}
    }
    function gaEv(event, params){
      var ua = ''
      try { ua = navigator.userAgent || '' } catch(_e) {}
      ga(event, Object.assign({ article_id: articleId, ua: ua }, params || {}))
    }

    function openIgModal(){
      if(!igModal) return
      igModal.classList.remove('hidden')
      document.body.style.overflow = 'hidden'
    }

    function closeIgModal(){
      if(!igModal) return
      igModal.classList.add('hidden')
      document.body.style.overflow = ''
      if (lastObjectUrl) { URL.revokeObjectURL(lastObjectUrl); lastObjectUrl='' }
      lastBlob = null
    }

    async function ensureBlob(){
      if (lastBlob) return lastBlob
      var res = await fetch(storyUrl, { cache: 'no-store' })
      var blob = await res.blob()
      lastBlob = blob
      return blob
    }

    function setBtnLoading(loading){
      try {
        if (!shareBtn) return
        if (loading) {
          shareBtn.setAttribute('data-prev', shareBtn.textContent || '')
          shareBtn.textContent = '準備中…'
          shareBtn.disabled = true
          shareBtn.classList.add('opacity-60','cursor-wait')
        } else {
          var prev = shareBtn.getAttribute('data-prev')
          if (prev != null) shareBtn.textContent = prev
          shareBtn.disabled = false
          shareBtn.classList.remove('opacity-60','cursor-wait')
        }
      } catch(_e){}
    }

    function showLoadingUI(){
      if (igLoading) igLoading.classList.remove('hidden')
      if (igPreview) igPreview.classList.add('hidden')
    }

    function showPreviewUI(){
      if (igLoading) igLoading.classList.add('hidden')
      if (igPreview) igPreview.classList.remove('hidden')
    }

    shareBtn.addEventListener('click', async function(){
      try {
        setBtnLoading(true)
        // If browser clearly doesn't support Web Share Level 2, open modal immediately with spinner
        if (!(navigator && navigator.canShare)) {
          showLoadingUI()
          openIgModal()
        }
        // ensure blob first to be able to evaluate canShare(files)
        var blob = await ensureBlob()
        var file = new File([blob], 'tabi-log-story.webp', { type: 'image/webp' })
        var canFiles = !!(navigator.canShare && navigator.canShare({ files: [file] }))
        gaEv('click_share_instagram', { method: canFiles ? 'web_share' : 'fallback', can_share_files: canFiles })
        if (canFiles) {
          await navigator.share({ files: [file], text: document.title })
          gaEv('share_instagram_success', { method: 'web_share' })
          return
        }
        var objUrl = URL.createObjectURL(blob)
        lastObjectUrl = objUrl
        if (igPreview) igPreview.setAttribute('src', objUrl)
        if (igDownload) igDownload.setAttribute('href', objUrl)
        showLoadingUI()
        openIgModal()
        // slight delay to ensure image element can layout before showing
        requestAnimationFrame(function(){ showPreviewUI() })
        gaEv('share_instagram_fallback_modal_shown', { method: 'fallback' })
      } catch (e) {
        console.warn('Share failed, falling back:', e)
        gaEv('share_instagram_error', { message: String((e && e.message) || e), method: 'error' })
        try {
          var blob2 = await ensureBlob()
          var objUrl2 = URL.createObjectURL(blob2)
          lastObjectUrl = objUrl2
          if (igPreview) igPreview.setAttribute('src', objUrl2)
          if (igDownload) igDownload.setAttribute('href', objUrl2)
          showLoadingUI()
        } catch(_err) {}
        openIgModal()
        requestAnimationFrame(function(){ showPreviewUI() })
      } finally {
        setBtnLoading(false)
      }
    })

    igClose && igClose.addEventListener('click', closeIgModal)
    igModal && igModal.addEventListener('click', function(e){ if (e.target === igModal) closeIgModal() })
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && igModal && !igModal.classList.contains('hidden')) closeIgModal() })

    // Copy link button
    var copyBtn = document.getElementById('ig-copy-link')
    copyBtn && copyBtn.addEventListener('click', async function(){
      var url = ''
      try { url = window.location.href } catch(_e) { url = '' }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url)
        } else {
          var ta = document.createElement('textarea')
          ta.value = url
          ta.style.position = 'fixed'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
        gaEv('copy_story_link', { method: 'fallback' })
        var prev = copyBtn.textContent
        copyBtn.textContent = 'コピーしました'
        setTimeout(function(){ copyBtn.textContent = prev }, 1500)
      } catch (e) {
        gaEv('copy_story_link_error', { method: 'fallback', message: String((e && e.message) || e) })
      }
    })

    igDownload && igDownload.addEventListener('click', function(){ gaEv('save_story_image', { method: 'fallback' }) })
  })
})();

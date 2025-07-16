// editorSchema.js (Global Scope Version)

//-------- headerA (dropdown nav with submenus) -----------
function getHeaderAFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'title', label: 'Title', type: 'text', default: '' },
    { key: 'logoImage', label: 'Logo Image URL', type: 'text', default: '' },
    { key: 'logoHref', label: 'Logo Link Href', type: 'text', default: '#' },
    { key: 'theme', label: 'Theme', type: 'select', options: ['dark', 'light'], default: 'dark' },
    { key: 'sticky', label: 'Sticky', type: 'checkbox', default: false },
    { key: 'transparent', label: 'Transparent', type: 'checkbox', default: false },
    { key: 'logoSize', label: 'Logo Size', type: 'text', default: '48px' },
    { key: 'nav', label: 'Navigation Menu', type: 'nav-editor', default: [] }
  ];
}

//-------- headerB (flat tabs with links) -----------
function getHeaderBFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'title', label: 'Title', type: 'text', default: '' },
    { key: 'logoImage', label: 'Logo Image URL', type: 'text', default: '' },
    { key: 'logoHref', label: 'Logo Link Href', type: 'text', default: '#' },
    { key: 'theme', label: 'Theme', type: 'select', options: ['dark', 'light'], default: 'light' },
    { key: 'logoSize', label: 'Logo Size', type: 'text', default: '48px' },
    { key: 'nav', label: 'Navigation Links', type: 'nav-simple', default: [] }
  ];
}

//-------- formEmbed (Google Form or iframe embed) -----------
function getFormEmbedFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'id', label: 'Element ID', type: 'text', default: '' },
    { key: 'title', label: 'Form Title', type: 'text', default: 'Submit a Form' },
    { key: 'description', label: 'Description', type: 'text', default: '' },
    { key: 'formUrl', label: 'Embed Form URL', type: 'text', default: '' },
    { key: 'height', label: 'Height', type: 'text', default: '600px' },
    { key: 'background', label: 'Background Color', type: 'text', default: '#111' },
    { key: 'className', label: 'CSS Class Name', type: 'text', default: '' }
  ];
}

//-------- carousel (image slider with slides) -----------
function getCarouselFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'slides', label: 'Slides', type: 'carousel-slides', default: [] },
    { key: 'width', label: 'Width', type: 'text', default: '80vw' },
    { key: 'height', label: 'Height', type: 'text', default: '400px' },
    { key: 'autoplay', label: 'Autoplay', type: 'checkbox', default: true },
    { key: 'delay', label: 'Delay (ms)', type: 'number', default: 4000 }
  ];
}

//-------- faq (accordion questions) -----------
function getFAQFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'theme', label: 'Theme', type: 'select', options: ['dark', 'light'], default: 'light' },
    { key: 'faqData', label: 'FAQ Sections', type: 'faq-blocks', default: [] }

  ];
}


//-------- photoBlock (image + button + positioning) -----------
function getPhotoBlockFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'image', label: 'Image URL', type: 'text', default: '' },
    { key: 'title', label: 'Title', type: 'text', default: '' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', default: '' },
    { key: 'buttonText', label: 'Button Text', type: 'text', default: '' },
    { key: 'buttonLink', label: 'Button Link', type: 'text', default: '#' },
    { key: 'buttonPosition', label: 'Button Position', type: 'select', options: ['top', 'center', 'bottom'], default: 'bottom' },
    { key: 'className', label: 'CSS Class Name', type: 'text', default: '' },
    { key: 'id', label: 'Element ID', type: 'text', default: '' },
    { key: 'position', label: 'Manual Position (Top/Left)', type: 'position-object', default: { top: null, left: null } },
    { key: 'isFixed', label: 'Fixed on Screen?', type: 'checkbox', default: false }
  ];
}


//-------- sectionGrid (grid of modular items) -----------
function getSectionGridFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'columns', label: 'Columns', type: 'number', default: 3 },
    { key: 'gap', label: 'Gap', type: 'text', default: '1rem' },
    { key: 'background', label: 'Background Color', type: 'text', default: '#222' },
    { key: 'items', label: 'Grid Items (PhotoBlocks)', type: 'section-grid-items', default: [] }
  ];
}


//-------- testimonialCarousel (horizontal slider for testimonials) -----------
function getTestimonialCarouselFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'width', label: 'Width', type: 'text', default: '80vw' },
    { key: 'height', label: 'Height', type: 'text', default: '400px' },
    { key: 'autoplay', label: 'Autoplay', type: 'checkbox', default: true },
    { key: 'delay', label: 'Delay (ms)', type: 'number', default: 5000 }
  ];
}

//-------- background (video backgrounds with opacity) -----------
function getBackgroundFields() {
  return [
    { key: 'containerId', label: 'Container ID', type: 'text', default: 'main' },
    { key: 'videoUrl', label: 'Background Video URL', type: 'text', default: '' },
    { key: 'opacity', label: 'Opacity (0–1)', type: 'number', default: 0.5 }
  ];
}

//-------- export full editorSchema map -----------
window.editorSchema = {
  headerA: { fields: getHeaderAFields() },
  headerB: { fields: getHeaderBFields() },
  formEmbed: { fields: getFormEmbedFields() },
  carousel: { fields: getCarouselFields() },
  faq: { fields: getFAQFields() },
  photoBlock: { fields: getPhotoBlockFields() },
  sectionGrid: { fields: getSectionGridFields() },
  testimonialCarousel: { fields: getTestimonialCarouselFields() },
  background: { fields: getBackgroundFields() }

  // Add more modules here...
};

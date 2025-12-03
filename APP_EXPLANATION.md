# Speed Reader App - Explanation

## 📖 What is This App?

**Speed Reader** is a web application that helps you read text faster using the **RSVP (Rapid Serial Visual Presentation)** technique. Instead of reading line by line, words appear one at a time at a fixed position on your screen, allowing you to read at speeds of 300-400+ words per minute while maintaining comprehension.

## 🎯 Main Purpose

The app is designed to:
- **Improve reading speed** - Read 2-3x faster than normal
- **Maintain comprehension** - Focus on one word at a time reduces distractions
- **Support multiple formats** - Read PDF, DOCX, or plain text files
- **Be accessible** - Available in English and Mongolian languages

## 🚀 Key Features

### 1. **File Upload & Processing**
- Upload PDF, DOCX, or TXT files
- Or paste text directly
- Server-side processing extracts text from files
- Maximum file size: 50MB

### 2. **Speed Reading Display**
- Words appear one at a time (or multiple words with "chunk size")
- Red dot indicates optimal reading point
- Adjustable reading speed (WPM - Words Per Minute)
- Range: 100-1000 WPM

### 3. **Reading Controls**
- **Play/Pause** - Start or stop reading
- **Reset** - Go back to beginning
- **Speed Adjustment** - Increase/decrease WPM
- **Chunk Size** - Read 1, 2, or 3 words at once
- **Punctuation Pause** - Automatically pause longer at sentence endings

### 4. **Keyboard Shortcuts**
- `Space` - Play/Pause
- `R` - Reset
- `↑/↓` - Increase/Decrease speed
- `←/→` - Navigate words
- `Esc` - Load new text

### 5. **Progress Tracking**
- Reading progress percentage
- Words read counter
- Time spent reading
- Remaining time estimate
- Quick jump to 25%, 50%, 75%, or start

### 6. **Multi-language Support**
- English (default)
- Mongolian (Монгол)
- Language switcher in header
- All UI elements translated

### 7. **Dark Mode**
- Toggle between light and dark themes
- Respects system preferences
- Smooth transitions

## 🧠 How RSVP Works

**RSVP (Rapid Serial Visual Presentation)** is a scientifically proven technique:

1. **Eliminates eye movement** - Your eyes don't need to move across the page
2. **Reduces subvocalization** - You stop "hearing" words in your head
3. **Increases focus** - One word at a time reduces distractions
4. **Improves speed** - Can read 2-3x faster than normal reading

### The Science:
- Normal reading: ~200-250 WPM
- Speed reading with RSVP: 300-400+ WPM
- Comprehension maintained or improved due to better focus

## 📁 Technical Architecture

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **next-intl** - Internationalization
- **React Hooks** - State management

### Backend
- **Next.js API Routes** - Server-side file processing
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

### Key Components
- `MainPage` - Main landing page
- `SpeedReader` - Core reading interface
- `FileUploader` - File upload component
- `ProgressBar` - Reading statistics
- `LanguageSwitcher` - Language selection
- `ThemeProvider` - Dark mode support

### Key Hooks
- `useSpeedReader` - Reading logic and state
- `useFileProcessor` - File processing logic

## 🎨 User Experience Flow

1. **Landing** - User sees upload area or paste text option
2. **Upload/Paste** - User provides text content
3. **Processing** - File is processed (if uploaded)
4. **Reading** - User adjusts settings and starts reading
5. **Control** - User can pause, adjust speed, navigate
6. **Complete** - User finishes or loads new text

## 🔒 Security Features

- File type validation
- File size limits (50MB)
- Rate limiting on API (10 requests/minute)
- Security headers (XSS, CSRF protection)
- Server-side file processing (no client-side file access)

## 📊 Performance Optimizations

- Code splitting (automatic with Next.js)
- Image optimization
- Compression enabled
- Memoization for word processing
- Efficient timer management
- Responsive design for mobile/tablet

## 🌐 SEO & Discoverability

- Comprehensive metadata (Open Graph, Twitter Cards)
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt
- Multi-language support for SEO
- Canonical URLs

## 🎯 Target Users

- **Students** - Read textbooks and articles faster
- **Professionals** - Process documents quickly
- **Language Learners** - Practice reading in different languages
- **Anyone** - Who wants to read faster and more efficiently

## 💡 Use Cases

1. **Academic Reading** - Read research papers, textbooks faster
2. **News Articles** - Process daily news quickly
3. **Documentation** - Read technical docs efficiently
4. **Language Practice** - Practice reading in Mongolian or English
5. **Accessibility** - Help people with reading difficulties focus better

## 🚀 Future Enhancements (Potential)

- User accounts and reading history
- Bookmark functionality
- Reading statistics over time
- Custom themes
- More file formats (EPUB, etc.)
- Mobile app version
- Offline support (PWA)

## 📱 Responsive Design

- **Desktop** - Full-featured experience
- **Tablet** - Optimized layout
- **Mobile** - Touch-friendly controls

## 🌍 Internationalization

- Fully translated UI
- Locale-aware URLs (`/` for English, `/mn` for Mongolian)
- Proper language detection
- Cookie-based locale preference

---

**In Summary**: This is a modern, production-ready speed reading application that helps users read faster using proven RSVP techniques, with support for multiple file formats, languages, and a beautiful, accessible interface.


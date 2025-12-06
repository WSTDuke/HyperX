import React from 'react';

// =======================================================
// INLINE MARKDOWN PARSER
// =======================================================

// Hàm parse inline markdown (bold, italic, code, links)
const parseInlineMarkdown = (text) => {
    const parts = [];
    let key = 0;

    // Các pattern regex cho inline markdown. Xử lý từ dài nhất (***) đến ngắn nhất (*)
    const patterns = [
        // Code inline: `(.+?)`
        { regex: /`(.+?)`/g, render: (match, text) => <code key={key++} className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">{text}</code> },
        // Bold Italic: ***(.+?)***
        { regex: /\*\*\*(.+?)\*\*\*/g, render: (match, text) => <strong key={key++} className="font-bold italic">{text}</strong> },
        // Bold: **(.+?)**
        { regex: /\*\*(.+?)\*\*/g, render: (match, text) => <strong key={key++} className="font-bold">{text}</strong> },
        { regex: /__(.+?)__/g, render: (match, text) => <strong key={key++} className="font-bold">{text}</strong> },
        // Italic: *(.+?)*
        { regex: /\*(.+?)\*/g, render: (match, text) => <em key={key++} className="italic">{text}</em> },
        { regex: /_(.+?)_/g, render: (match, text) => <em key={key++} className="italic">{text}</em> },
        // Links: [text](url)
        { regex: /\[(.+?)\]\((.+?)\)/g, render: (match, text, url) => <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">{text}</a> },
    ];

    let segments = [text];

    patterns.forEach(pattern => {
        let newSegments = [];
        segments.forEach(segment => {
            if (typeof segment !== 'string') {
                newSegments.push(segment);
                return;
            }

            const regex = new RegExp(pattern.regex, 'g');
            let match;
            let lastIndex = 0;

            // Xử lý bằng cách lặp qua các match để phân tách segment
            while ((match = regex.exec(segment)) !== null) {
                // Thêm text trước match (nếu có)
                if (match.index > lastIndex) {
                    newSegments.push(segment.slice(lastIndex, match.index));
                }

                // Thêm rendered element
                newSegments.push(pattern.render(match[0], ...match.slice(1)));

                lastIndex = match.index + match[0].length;
            }

            // Thêm text còn lại
            if (lastIndex < segment.length) {
                newSegments.push(segment.slice(lastIndex));
            }
        });
        segments = newSegments;
    });

    return segments;
};

// =======================================================
// BLOCK-LEVEL PARSER AND RENDERER
// =======================================================

// Component chính để render Markdown
const MarkdownText = ({ text }) => {
    if (!text) return null;

    // Các component hỗ trợ cho MarkdownText
    const H1 = ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>;
    const H2 = ({ children }) => <h2 className="text-xl font-bold mt-4 mb-2 border-b border-gray-700 pb-1">{children}</h2>;
    const H3 = ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
    const P = ({ children }) => <p className="my-2">{children}</p>;
    const CodeBlock = ({ content }) => (
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg my-3 overflow-x-auto whitespace-pre-wrap break-all">
            <code className="text-sm font-mono">{content}</code>
        </pre>
    );
    const Blockquote = ({ children }) => (
        <blockquote className="border-l-4 border-indigo-500 pl-3 my-2 italic text-gray-300 bg-gray-800/50 p-2 rounded-r-lg">{children}</blockquote>
    );

    // Hàm parse block-level markdown thành JSX
    const parseMarkdown = (rawText) => {
        const lines = rawText.split('\n');
        const elements = [];
        let inCodeBlock = false;
        let codeBlockContent = [];
        let listBuffer = [];
        let isOrderedList = false;
        let paragraphBuffer = [];
        let blockquoteBuffer = []; // Thêm buffer cho blockquote
        let keyIndex = 0;

        // Hàm kết thúc và render Blockquote Buffer
        const processBlockquoteBuffer = () => {
            if (blockquoteBuffer.length > 0) {
                // Ghép các dòng thành một chuỗi, sau đó parse inline markdown
                const quoteContent = blockquoteBuffer.join('\n').trim();
                if (quoteContent) {
                    elements.push(<Blockquote key={`blockquote-${keyIndex++}`}>{parseInlineMarkdown(quoteContent)}</Blockquote>);
                }
                blockquoteBuffer = [];
            }
        };

        // Hàm kết thúc và render List Buffer
        const processListBuffer = () => {
            if (listBuffer.length > 0) {
                const ListTag = isOrderedList ? 'ol' : 'ul';
                elements.push(
                    <ListTag key={`list-${keyIndex++}`} className={`ml-6 my-2 ${isOrderedList ? 'list-decimal' : 'list-disc'} space-y-1`}>
                        {listBuffer.map((item, index) => (
                            // SỬA: Thay thế \n bằng dấu cách cho các dòng nối tiếp trong list item
                            <li key={index} className="pl-2">{parseInlineMarkdown(item.trim().replace(/\n+/g, ' '))}</li>
                        ))}
                    </ListTag>
                );
                listBuffer = [];
                isOrderedList = false;
            }
        };

        // Hàm kết thúc và render Paragraph Buffer
        const processParagraphBuffer = () => {
            if (paragraphBuffer.length > 0) {
                // Ghép các dòng thành một đoạn, phân tách bằng dấu cách
                const paragraphContent = paragraphBuffer.join(' ').trim();
                if (paragraphContent) {
                    elements.push(<P key={`p-${keyIndex++}`}>{parseInlineMarkdown(paragraphContent)}</P>);
                }
                paragraphBuffer = [];
            }
        };

        lines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();

            // 0. Dòng trống
            if (trimmedLine === '') {
                processBlockquoteBuffer(); // Dòng trống kết thúc Blockquote
                processListBuffer(); // Dòng trống kết thúc List
                processParagraphBuffer(); // Dòng trống kết thúc Paragraph
                return;
            }

            // 1. Code block (```)
            if (trimmedLine.startsWith('```')) {
                processBlockquoteBuffer(); 
                processListBuffer(); 
                processParagraphBuffer(); 
                
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockContent = [];
                } else {
                    // Xóa language tag ở dòng đầu tiên nếu có
                    const content = codeBlockContent.join('\n');
                    elements.push(<CodeBlock key={`code-${keyIndex++}`} content={content} />);
                    inCodeBlock = false;
                }
                return;
            }

            // 1b. Nội dung Code block
            if (inCodeBlock) {
                codeBlockContent.push(line);
                return;
            }
            
            // 2. Header
            if (trimmedLine.startsWith('#')) {
                processBlockquoteBuffer(); 
                processListBuffer(); 
                processParagraphBuffer(); 
                
                if (trimmedLine.startsWith('### ')) {
                    elements.push(<H3 key={`h3-${keyIndex++}`}>{parseInlineMarkdown(trimmedLine.slice(4))}</H3>);
                } else if (trimmedLine.startsWith('## ')) {
                    elements.push(<H2 key={`h2-${keyIndex++}`}>{parseInlineMarkdown(trimmedLine.slice(3))}</H2>);
                } else if (trimmedLine.startsWith('# ')) {
                    elements.push(<H1 key={`h1-${keyIndex++}`}>{parseInlineMarkdown(trimmedLine.slice(2))}</H1>);
                }
                return;
            }

            // 3. Lists
            const unorderedMatch = trimmedLine.match(/^([*-+]\s)(.*)/);
            const orderedMatch = trimmedLine.match(/^(\d+\.\s)(.*)/);

            if (unorderedMatch || orderedMatch) {
                processBlockquoteBuffer();
                processParagraphBuffer(); 
                
                const currentIsOrdered = !!orderedMatch;
                const listItemText = currentIsOrdered ? orderedMatch[2] : unorderedMatch[2];
                
                // Nếu đang trong list nhưng kiểu list thay đổi => kết thúc list cũ
                if (listBuffer.length > 0 && isOrderedList !== currentIsOrdered) {
                    processListBuffer();
                }
                
                // Cập nhật và thêm vào buffer
                isOrderedList = currentIsOrdered;
                listBuffer.push(listItemText);
                return;
            }
            
            // 4. Blockquote
            if (trimmedLine.startsWith('>')) { 
                processListBuffer(); 
                processParagraphBuffer(); 
                
                // SỬA: Thêm vào buffer để hợp nhất
                const quoteText = trimmedLine.slice(1).trim();
                blockquoteBuffer.push(quoteText);
                return;
            }
            
            // 5. Horizontal Rule (--- hoặc ***)
            if (trimmedLine === '---' || trimmedLine === '***') {
                processBlockquoteBuffer(); 
                processListBuffer(); 
                processParagraphBuffer(); 
                elements.push(<hr key={`hr-${keyIndex++}`} className="my-3 border-gray-600" />);
                return;
            }

            // 6. List/Blockquote continuation hoặc Normal paragraph
            if (listBuffer.length > 0) {
                // List continuation: Thêm nội dung vào list item cuối
                listBuffer[listBuffer.length - 1] += '\n' + line;
            } else if (blockquoteBuffer.length > 0) {
                // Blockquote continuation: Thêm nội dung vào blockquote buffer (sẽ được ghép sau)
                blockquoteBuffer.push(line);
            } else {
                // Normal paragraph: Thêm vào paragraph buffer
                paragraphBuffer.push(line);
            }
        });

        // Xử lý các buffer còn lại sau khi kết thúc vòng lặp
        processBlockquoteBuffer();
        processListBuffer(); 
        processParagraphBuffer(); 

        return elements;
    };

    return (
        <div className="text-sm leading-relaxed font-sans">
            {parseMarkdown(text)}
        </div>
    );
};

export default MarkdownText;
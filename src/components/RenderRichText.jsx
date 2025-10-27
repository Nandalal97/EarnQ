import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import DOMPurify from 'dompurify';

const RenderRichText = ({ text }) => {
  if (!text) return null;

  // 👇 Convert double backslashes (\\) to real backslashes (\)
  const unescaped = text.replace(/\\\\/g, '\\');

  // 👇 Split by block (\[...\]) and inline (\(...\)) math
  const parts = unescaped.split(/(\\\[.*?\\\]|\\\(.*?\\\))/g);

  return parts.map((part, idx) => {
    if (part.startsWith('\\[') && part.endsWith('\\]')) {
      return <BlockMath key={idx}>{part.slice(2, -2)}</BlockMath>;
    } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
      return <InlineMath key={idx}>{part.slice(2, -2)}</InlineMath>;
    } else {
      return (
        <span
          key={idx}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(part) }}
        />
      );
    }
  });
};

export default RenderRichText;

// biome-ignore-all lint/correctness/noUnusedVariables: scripts

/**
 * Preprocessor function for the template rendering.
 * @param {string} markdown - The markdown content.
 * @param {Object} options - The options object.
 * @returns {Promise<string>} - The preprocessed markdown content.
 */
export default (markdown, _) => {
  return new Promise((resolve, _) => {
    // Handle mermaid code blocks
    const markup = markdown.replace(/```mermaid\n([\s\S]*?)\n```/g, '<pre class="mermaid">\n$1\n</pre>');

    return resolve(markup);
  });
};

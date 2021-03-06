import React, { useCallback, useMemo } from "react";
import { Editable, withReact, Slate } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";

const RichTextExample = ({ content, notFormat }) => {
  const value = JSON.parse(content);
  const renderElement = useCallback(
    (props) => (notFormat ? <Normal {...props} /> : <Element {...props} />),
    [notFormat]
  );
  const renderLeaf = useCallback(
    (props) => (notFormat ? <Normal {...props} /> : <Leaf {...props} />),
    [notFormat]
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value}>
      <Editable
        readOnly={true}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
};

const Normal = ({ children }) => <>{children} </>;

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
export default RichTextExample;

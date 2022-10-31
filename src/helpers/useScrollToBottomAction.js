import * as React from "react";

export default function useScrollToBottomAction(
  container,
  callback,
  offset = 0
) {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!container) return;
    const handleScroll = () => {
      let scrollContainer =
        container === document ? document.scrollingElement : container;

      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - offset
      ) {
        callbackRef.current();
      }
    };

    const events = ["scroll", "wheel"];
    events.forEach((event) => {
      container.addEventListener(event, handleScroll);

    })

    return () => {
      events.forEach((event) => {
        container.removeEventListener(event, handleScroll);
      })
    };
  }, [container, offset]);
}
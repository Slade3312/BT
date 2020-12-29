import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/** *
 * @param children
 * @param onIntersectIn - call just after intersection has detected
 * @param detectInLimit - count of callbacks calls that is required after mounting the component
 * @param threshold - percent of intersection node to call
 */
export default function InViewPortDetector({ children, onIntersectIn, detectInLimit, threshold }) {
  const currentRef = useRef();
  let observer = null;

  const unobserve = () => observer.unobserve(currentRef.current);

  useEffect(() => {
    let intersectInCount = 0;
    observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (onIntersectIn && firstEntry.isIntersecting) {
          onIntersectIn();
          intersectInCount += 1;
          if (detectInLimit > 0 && detectInLimit === intersectInCount) {
            unobserve();
          }
        }
      },
      { root: null, threshold },
    );
    observer.observe(currentRef.current);
    return unobserve;
  }, []);
  return <div ref={currentRef}>{children}</div>;
}

InViewPortDetector.propTypes = {
  children: PropTypes.node,
  onIntersectIn: PropTypes.func,
  detectInLimit: PropTypes.number,
  threshold: PropTypes.number,
};

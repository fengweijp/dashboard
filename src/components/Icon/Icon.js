import React, { PropTypes } from 'react'

export default function Icon ({
  ...props,
  src,
  color = '',
  width = 16,
  height = 16,
  className = '',
}) {
  return (
    <svg
      {...props}
      className={className}
      width={width}
      height={height}
      fill={color}
      dangerouslySetInnerHTML={{__html: src}}
      />
  )
}

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
}

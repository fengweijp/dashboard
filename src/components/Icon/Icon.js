import React, { PropTypes } from 'react'

export default function Icon ({
  glyph,
  color = '#000',
  width = 16,
  height = 16,
  className = '',
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      fill={color}
      >
      <use xlinkHref={glyph} />
    </svg>
  )
}

Icon.propTypes = {
  glyph: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
}

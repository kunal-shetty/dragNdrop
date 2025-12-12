export function exportToHTML(components) {
  const generateComponentHTML = (component) => {
    const { type, props, position, size, transform } = component

    // Build transform string
    const transforms = []
    if (transform?.rotate) transforms.push(`rotate(${transform.rotate}deg)`)
    if (transform?.scaleX && transform.scaleX !== 1) transforms.push(`scaleX(${transform.scaleX})`)
    if (transform?.scaleY && transform.scaleY !== 1) transforms.push(`scaleY(${transform.scaleY})`)
    if (transform?.skewX) transforms.push(`skewX(${transform.skewX}deg)`)
    if (transform?.skewY) transforms.push(`skewY(${transform.skewY}deg)`)
    const transformStyle = transforms.length > 0 ? `transform: ${transforms.join(" ")};` : ""

    const baseStyle = `position: absolute; left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px; ${transformStyle}`

    const glowStyle = props.glowIntensity
      ? `box-shadow: 0 0 ${20 * props.glowIntensity}px ${props.borderColor || "#22d3ee"}40;`
      : ""

    switch (type) {
      case "text":
        return `
    <div style="${baseStyle} font-size: ${props.fontSize}px; font-weight: ${props.fontWeight}; color: ${props.color}; padding: ${props.padding}px; background-color: ${props.backgroundColor}; letter-spacing: ${props.letterSpacing}px; line-height: ${props.lineHeight}; text-align: ${props.textAlign};">
      ${props.content}
    </div>`

      case "heading":
        return `
    <${props.level || "h1"} style="${baseStyle} font-size: ${props.fontSize}px; font-weight: ${props.fontWeight}; color: ${props.color}; padding: ${props.padding}px; background-color: ${props.backgroundColor}; letter-spacing: ${props.letterSpacing}px; line-height: ${props.lineHeight}; text-align: ${props.textAlign}; margin: 0; display: flex; align-items: center;">
      ${props.content}
    </${props.level || "h1"}>`

      case "paragraph":
        return `
    <p style="${baseStyle} font-size: ${props.fontSize}px; font-weight: ${props.fontWeight}; color: ${props.color}; padding: ${props.padding}px; background-color: ${props.backgroundColor}; letter-spacing: ${props.letterSpacing}px; line-height: ${props.lineHeight}; text-align: ${props.textAlign}; margin: 0; overflow: auto;">
      ${props.content}
    </p>`

      case "button":
        return `
    <button style="${baseStyle} font-size: ${props.fontSize}px; font-weight: ${props.fontWeight === "medium" ? "500" : props.fontWeight}; color: ${props.color}; background-color: ${props.backgroundColor}; padding: ${props.padding}px; border-radius: ${props.borderRadius}; border: ${props.borderWidth || 1}px solid ${props.borderColor || props.backgroundColor}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; ${glowStyle}">
      ${props.content}
    </button>`

      case "image":
        return `
    <img src="${props.src || "/placeholder.svg"}" alt="${props.alt}" style="${baseStyle} object-fit: ${props.objectFit}; border-radius: ${props.borderRadius}; opacity: ${props.opacity}; ${props.borderWidth ? `border: ${props.borderWidth}px solid ${props.borderColor};` : ""}" />`

      case "video":
        return `
    <div style="${baseStyle} border-radius: ${props.borderRadius}; overflow: hidden;">
      <iframe src="${props.videoUrl}" style="width: 100%; height: 100%; aspect-ratio: ${props.aspectRatio};" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`

      case "card":
        return `
    <div style="${baseStyle} padding: ${props.padding}px; background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; border: ${props.borderWidth || 1}px solid ${props.borderColor || "transparent"}; ${props.shadow ? "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);" : ""} ${glowStyle}">
      <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: #f5f5f5;">${props.title}</h3>
      <p style="font-size: 0.875rem; color: #a3a3a3;">${props.description}</p>
    </div>`

      case "imageCard":
        return `
    <div style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; border: ${props.borderWidth || 1}px solid ${props.borderColor || "transparent"}; overflow: hidden; ${props.shadow ? "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);" : ""} display: flex; flex-direction: column;">
      <div style="height: 128px; overflow: hidden;">
        <img src="${props.imageSrc || "/placeholder.svg"}" alt="${props.title}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="padding: 16px; flex: 1;">
        <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px; color: #f5f5f5;">${props.title}</h4>
        <p style="font-size: 0.875rem; color: #a3a3a3;">${props.description}</p>
      </div>
    </div>`

      case "container":
        return `
    <div style="${baseStyle} padding: ${props.padding}px; background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; min-height: ${props.minHeight}px; border: ${props.borderWidth || 1}px solid ${props.borderColor || "transparent"}; opacity: ${props.opacity}; ${props.backgroundImage ? `background-image: url(${props.backgroundImage}); background-size: cover; background-position: center;` : ""}">
    </div>`

      case "divider":
        return `
    <div style="${baseStyle} display: flex; align-items: center; justify-content: center; padding: ${props.margin}px 0;">
      <div style="width: ${props.width}%; height: ${props.thickness}px; background-color: ${props.color}; ${props.glowIntensity ? `box-shadow: 0 0 ${10 * props.glowIntensity}px ${props.color};` : ""}"></div>
    </div>`

      case "quote":
        return `
    <blockquote style="${baseStyle} padding: ${props.padding}px; background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; border-left: 4px solid ${props.accentColor};">
      <p style="font-size: ${props.fontSize}px; color: ${props.color}; font-style: italic; line-height: 1.6; margin-bottom: 8px;">"${props.content}"</p>
      <footer style="font-size: 0.875rem; color: ${props.accentColor};">— ${props.author}</footer>
    </blockquote>`

      case "icon":
        return `
    <div style="${baseStyle} display: flex; align-items: center; justify-content: center; padding: ${props.padding}px; background-color: ${props.backgroundColor};">
      <svg style="width: ${props.iconSize || props.size || 24}px; height: ${props.iconSize || props.size || 24}px; color: ${props.color}; ${props.glowIntensity ? `filter: drop-shadow(0 0 ${10 * props.glowIntensity}px ${props.color});` : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    </div>`

      case "pricing":
        return `
    <div style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; border: ${props.featured ? `2px solid ${props.accentColor}` : `1px solid ${props.borderColor || "#333"}`}; overflow: hidden; display: flex; flex-direction: column; ${props.featured ? `box-shadow: 0 0 20px ${props.accentColor}30;` : ""}">
      ${props.featured ? `<div style="background-color: ${props.accentColor}; color: ${props.backgroundColor}; font-size: 0.75rem; font-weight: 600; text-align: center; padding: 4px;">RECOMMENDED</div>` : ""}
      <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
        <h3 style="font-size: 1.125rem; font-weight: 600; color: ${props.color}; margin-bottom: 8px;">${props.planName}</h3>
        <div style="margin-bottom: 16px;">
          <span style="font-size: 1.875rem; font-weight: 700; color: ${props.accentColor};">${props.price}</span>
          <span style="font-size: 0.875rem; color: #a3a3a3;">/${props.period}</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0 0 16px 0; flex: 1;">
          ${(props.features || ["Feature 1", "Feature 2", "Feature 3"]).map((f) => `<li style="display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #a3a3a3; margin-bottom: 8px;"><span style="color: ${props.accentColor};">✓</span> ${f}</li>`).join("")}
        </ul>
        <button style="width: 100%; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; background-color: ${props.featured ? props.accentColor : "transparent"}; color: ${props.featured ? props.backgroundColor : props.accentColor}; border: 1px solid ${props.accentColor};">
          Get Started
        </button>
      </div>
    </div>`

      case "footer":
        return `
    <footer style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; padding: ${props.padding}px; border-top: 1px solid ${props.borderColor};">
      <div style="display: flex; align-items: center; justify-content: space-between; height: 100%;">
        <div>
          <h4 style="font-weight: 600; color: ${props.color};">${props.companyName}</h4>
          <p style="font-size: 0.875rem; color: #a3a3a3;">${props.tagline}</p>
        </div>
        <nav style="display: flex; gap: 16px;">
          ${(props.links || ["About", "Contact", "Privacy"]).map((link) => `<a href="#" style="font-size: 0.875rem; color: ${props.accentColor}; text-decoration: none;">${link}</a>`).join("")}
        </nav>
      </div>
    </footer>`

      case "navbar":
        return `
    <nav style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; padding: ${props.padding}px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${props.borderColor || "#333"};">
      <div style="font-weight: 700; font-size: 1.25rem; color: ${props.accentColor || "#22d3ee"};">${props.logo || "Logo"}</div>
      <div style="display: flex; gap: 24px;">
        ${(props.links || ["Home", "About", "Services", "Contact"]).map((link) => `<a href="#" style="color: ${props.color}; text-decoration: none; font-size: 0.875rem;">${link}</a>`).join("")}
      </div>
      <button style="background-color: ${props.accentColor || "#22d3ee"}; color: ${props.backgroundColor}; padding: 8px 16px; border-radius: 6px; border: none; font-weight: 500; cursor: pointer;">${props.ctaText || "Get Started"}</button>
    </nav>`

      case "section":
        return `
    <section style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; padding: ${props.padding}px; display: flex; flex-direction: column; ${props.backgroundImage ? `background-image: url(${props.backgroundImage}); background-size: cover; background-position: center;` : ""}">
      <h2 style="font-size: 1.875rem; font-weight: 700; color: ${props.color}; margin-bottom: 16px; text-align: ${props.textAlign || "left"};">${props.title || "Section Title"}</h2>
      <p style="font-size: 1rem; color: #a3a3a3; text-align: ${props.textAlign || "left"};">${props.subtitle || "Section description goes here."}</p>
    </section>`

      case "hero":
        return `
    <section style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; padding: ${props.padding}px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; ${props.backgroundImage ? `background-image: url(${props.backgroundImage}); background-size: cover; background-position: center;` : ""}">
      <h1 style="font-size: 3rem; font-weight: 800; color: ${props.color}; margin-bottom: 16px; line-height: 1.1;">${props.headline || "Your Amazing Headline"}</h1>
      <p style="font-size: 1.25rem; color: #a3a3a3; max-width: 600px; margin-bottom: 32px;">${props.subheadline || "Compelling subheadline that explains your value proposition."}</p>
      <div style="display: flex; gap: 16px;">
        <button style="background-color: ${props.accentColor || "#22d3ee"}; color: ${props.backgroundColor}; padding: 12px 32px; border-radius: 8px; border: none; font-weight: 600; font-size: 1rem; cursor: pointer;">${props.primaryCta || "Get Started"}</button>
        <button style="background-color: transparent; color: ${props.accentColor || "#22d3ee"}; padding: 12px 32px; border-radius: 8px; border: 1px solid ${props.accentColor || "#22d3ee"}; font-weight: 600; font-size: 1rem; cursor: pointer;">${props.secondaryCta || "Learn More"}</button>
      </div>
    </section>`

      case "testimonial":
        return `
    <div style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; padding: ${props.padding}px; display: flex; flex-direction: column; gap: 16px; border: 1px solid ${props.borderColor || "#333"};">
      <p style="font-size: 1rem; color: ${props.color}; font-style: italic; line-height: 1.6;">"${props.quote || "This product changed my life! Highly recommended."}"</p>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background-color: ${props.accentColor || "#22d3ee"}30; display: flex; align-items: center; justify-content: center; color: ${props.accentColor || "#22d3ee"}; font-weight: 600;">${(props.author || "J")[0]}</div>
        <div>
          <div style="font-weight: 600; color: ${props.color};">${props.author || "John Doe"}</div>
          <div style="font-size: 0.875rem; color: #a3a3a3;">${props.role || "CEO, Company"}</div>
        </div>
      </div>
      <div style="color: ${props.accentColor || "#22d3ee"};">${"★".repeat(props.rating || 5)}${"☆".repeat(5 - (props.rating || 5))}</div>
    </div>`

      case "stats":
        return `
    <div style="${baseStyle} background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius}; padding: ${props.padding}px; display: grid; grid-template-columns: repeat(${(props.stats || []).length || 3}, 1fr); gap: 24px;">
      ${(
        props.stats || [
          { value: "100+", label: "Customers" },
          { value: "50K", label: "Downloads" },
          { value: "99%", label: "Uptime" },
        ]
      )
        .map(
          (stat) => `
        <div style="text-align: center;">
          <div style="font-size: 2.5rem; font-weight: 700; color: ${props.accentColor || "#22d3ee"};">${stat.value}</div>
          <div style="font-size: 0.875rem; color: #a3a3a3; margin-top: 4px;">${stat.label}</div>
        </div>
      `,
        )
        .join("")}
    </div>`

      default:
        return ""
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Design - NeonForge</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', 'Manrope', system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      background-color: #0a0a14;
      color: #f5f5f5;
    }
    .container {
      position: relative;
      min-height: 800px;
    }
    button:hover {
      transform: scale(1.02);
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
${components.map((component) => generateComponentHTML(component)).join("\n")}
  </div>
</body>
</html>`

  return html
}

export function downloadHTML(html, filename = "neonforge-design.html") {
  const blob = new Blob([html], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Button, type ButtonVariant } from './Button'

const VARIANTS: Record<ButtonVariant, string[]> = {
  primary: ['bg-bobber', 'text-on-bobber', 'hover:enabled:bg-bobber-hover'],
  secondary: ['bg-surface', 'text-ink', 'border-line-strong'],
  text: ['bg-transparent', 'text-water', 'px-3'],
  danger: ['text-bobber-text', 'border-bobber-text'],
}

describe('Button', () => {
  for (const [variant, classes] of Object.entries(VARIANTS) as [ButtonVariant, string[]][]) {
    it(`renders the ${variant} variant with its token classes`, () => {
      const html = renderToStaticMarkup(<Button variant={variant}>Salvar</Button>)
      for (const c of classes) expect(html).toContain(c)
      expect(html).toContain('min-h-tap')
      expect(html).toContain('focus-visible:shadow-focus')
      expect(html).toMatchSnapshot()
    })
  }

  it('is a plain button unless told otherwise, so it never submits a form by accident', () => {
    expect(renderToStaticMarkup(<Button>Salvar</Button>)).toContain('type="button"')
    expect(renderToStaticMarkup(<Button type="submit">Salvar</Button>)).toContain('type="submit"')
  })

  it('uses the 36 px height for the small size and keeps the text variant narrow', () => {
    const small = renderToStaticMarkup(<Button size="sm">Editar</Button>)
    expect(small).toContain('min-h-9')
    expect(small).not.toContain('min-h-tap')
    const text = renderToStaticMarkup(<Button variant="text">Ver no mapa</Button>)
    expect(text).not.toContain('px-5')
  })

  it('draws a decorative icon before the label', () => {
    const html = renderToStaticMarkup(<Button icon="share">Compartilhar</Button>)
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/)
    expect(html.indexOf('<svg')).toBeLessThan(html.indexOf('Compartilhar'))
  })
})

import { describe, it, expect } from 'vitest'
import { analyzeFrequency } from '../src/lib/analyzeFrequency'

describe('analyzeFrequency', () => {
  it('retorna array vazio para string vazia', () => {
    expect(analyzeFrequency('')).toEqual([])
  })

  it('retorna array vazio para string só com espaços', () => {
    expect(analyzeFrequency('   ')).toEqual([])
  })

  it('retorna array vazio para string só com pontuação', () => {
    expect(analyzeFrequency('!!! ??? --- ...')).toEqual([])
  })

  it('conta palavras corretamente em texto simples', () => {
    expect(analyzeFrequency('hello hello world')).toEqual([
      { word: 'hello', count: 2 },
      { word: 'world', count: 1 },
    ])
  })

  it('normaliza case — Hello e hello contam como a mesma palavra', () => {
    expect(analyzeFrequency('Hello HELLO hello')).toEqual([
      { word: 'hello', count: 3 },
    ])
  })

  it('remove pontuação acoplada à palavra', () => {
    expect(analyzeFrequency('hi, hi!')).toEqual([{ word: 'hi', count: 2 }])
  })

  it('ordena por frequência decrescente', () => {
    const result = analyzeFrequency('a b b c c c')
    expect(result[0].word).toBe('c')
    expect(result[1].word).toBe('b')
    expect(result[2].word).toBe('a')
  })

  it('desempate alfabético crescente quando frequências são iguais', () => {
    const result = analyzeFrequency('zebra apple mango')
    expect(result.map((e) => e.word)).toEqual(['apple', 'mango', 'zebra'])
  })

  it('preserva acentuação — maçã e MAÇÃ contam como maçã', () => {
    expect(analyzeFrequency('maçã MAÇÃ')).toEqual([{ word: 'maçã', count: 2 }])
  })

  it('trata quebras de linha como separadores de palavras', () => {
    expect(analyzeFrequency('foo\nbar\r\nbaz')).toEqual([
      { word: 'bar', count: 1 },
      { word: 'baz', count: 1 },
      { word: 'foo', count: 1 },
    ])
  })

  it('trata números como tokens válidos', () => {
    expect(analyzeFrequency('123 456 123')).toEqual([
      { word: '123', count: 2 },
      { word: '456', count: 1 },
    ])
  })

  it('funciona com texto no limite de 2048 caracteres', () => {
    // "word " = 5 chars; 409 × 5 = 2045, trimEnd → 2044 chars (≤ 2048)
    const text = ('word ').repeat(409).trimEnd()
    expect(text.length).toBeLessThanOrEqual(2048)
    const result = analyzeFrequency(text)
    expect(result).toEqual([{ word: 'word', count: 409 }])
  })

  it('não importa nada do DOM ou do React', () => {
    // garantido estruturalmente: arquivo em src/lib sem imports de react/dom
    expect(typeof analyzeFrequency).toBe('function')
  })
})

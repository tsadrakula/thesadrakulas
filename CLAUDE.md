@AGENTS.md

# Design conventions

- **Cards in a row must be uniform.** Any set of side-by-side cards (e.g. the
  parents cards on the Bridal Party page, the registry cards on the Registry
  page) must share the same height and shape regardless of how much content each
  one holds. When cards live inside a CSS grid, the grid cell stretches but the
  inner card does not — give the inner card `height: 100%` (and use a centered
  flex column when content length varies) so every card matches its siblings.

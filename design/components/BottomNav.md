# BottomNav

The phone tab bar, with Log as the raised bobber button in the middle.

- Five destinations: Feed, Álbum, Registrar, Desafios, Perfil. Groups live inside Feed and Perfil.
- The Log button is always bobber red and always reachable: it is the app's main action.
- On screens 1024px and wider, the same destinations move to a side rail.
- It sits fixed at the bottom, with the safe-area inset added to its padding.
- Consumer provides: `active`, the `hrefs` for each destination, and `lang`.

# Notes for picker-amendment-3.md

## Judgement Calls

1. **`Limón` added to `MOCK_CATALOG`**:
   Amendment 3 explicitly requested:
   > "add the products the mock orders use that are missing from it — `Manzana Roja`, `Jitomate`, `Queso Fresco`, `Huevo San Juan`, `Cebolla Blanca` — so every mocked line can translate. The English names must match `products.json` exactly."

   Mock order 1043 also contains `Limón` (`id: 22`, unit: `kg`, price: `3500`), which was not present in `MOCK_CATALOG`. In order to ensure that literally every mocked line across all mock orders (1042, 1043, and 1044) translates to English, `Limón` (`name_en: "Lime"`) was also added to `MOCK_CATALOG` matching `products.json` exactly.

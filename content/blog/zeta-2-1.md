---
title: "Zeta 2.1 - GGUF"
description: "Simple description of bluevoid-pl/zeta-2.1-GGUF: a direct GGUF of zed-industries/zeta-2.1, an 8B code next-edit-suggestion model finetuned from Seed-Coder-8B-Base."
date: "2026-08-26"
tags:
  - "Zeta"
  - "GGUF"
  - "Model"
  - "Code"
---

### Zeta 2.1 - GGUF

Direct GGUF of [zed-industries/zeta-2.1](https://huggingface.co/zed-industries/zeta-2.1), published by bluevoid-pl.

- Base model: `ByteDance-Seed/Seed-Coder-8B-Base`
- Size: 8B params
- Architecture: llama
- License: Apache 2.0
- HF: [bluevoid-pl/zeta-2.1-GGUF](https://huggingface.co/bluevoid-pl/zeta-2.1-GGUF)

#### Czym is

Zeta 2.1 is a code edit prediction model (next-edit suggestion). Given code context, edit history and an editable region around the cursor, it predicts the rewritten content for that region.

Quantizations prefixed with `I` use the `zed-industries/zeta` dataset plus `groups_merged.txt` for the imatrix.

#### Running

```bash
ollama run hf.co/bluevoid-pl/zeta-2.1-GGUF:Q4_K_M
```

#### Quantizations

| Quant  | Size   |
| ------ | ------ |
| Q4_K_M | 5.07 GB |
| Q8_0   | 8.77 GB |
| BF16   | 16.5 GB |

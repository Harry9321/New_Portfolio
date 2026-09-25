Start with a one-paragraph hook: the problem, and the result. This file is a template and is not listed on the site.

## The problem

Explain the context in plain words. What was slow, broken, or risky?

## What I tried

Walk through the approach. Code blocks get syntax highlighting:

```python
from celery import group

job = group(validate.s(chunk) for chunk in chunks)
result = job.apply_async()
```

> Use a quote for a key insight you want readers to remember.

## Results

| Metric            | Before | After |
|-------------------|--------|-------|
| Validation time   | 40 min | 3 min |

Images go in `assets/img/blog/` and are referenced like this:

![Architecture diagram](../assets/img/blog/example.png)

A video can be embedded by pasting its link on its own line inside an HTML block:

<div class="embed" data-video="https://www.youtube.com/watch?v=VIDEO_ID"></div>

## Takeaways

- One lesson per bullet.
- Keep them short.

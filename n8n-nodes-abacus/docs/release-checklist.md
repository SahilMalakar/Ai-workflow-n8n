# Release Checklist

Before every `npm publish`:

- [ ] All tests pass (`npm run build` succeeds with no errors)
- [ ] `CHANGELOG.md` updated with new version and changes
- [ ] `package.json` version bumped (semver)
- [ ] `dist/` is up to date (`npm run build`)
- [ ] Credential test works against mock server
- [ ] All 10 resources tested manually in n8n UI
- [ ] README reflects any new features or breaking changes
- [ ] Git tag created matching the version (`git tag v0.x.x`)
- [ ] GitHub release created (triggers `publish.yml` workflow)

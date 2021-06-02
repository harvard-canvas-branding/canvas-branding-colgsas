# canvas-branding-colgsas
Static assets for branding the FAS Canvas sub-account

Process overview:
- Push changes to JS or CSS files.
- Kicks off CodeBuild to build the JS and CSS files.
- Store build in S3.
- Manually upload the JS and/or CSS files to Canvas via the Theme editor.

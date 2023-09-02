# BakkesModWiki-Hugo
This is the development repo for the BakkesMod Programming Wiki!

## Developer installation
1. Clone the repo
1. Ensure that you have a `hugo.exe` binary in the root of the repo. This is needed to run the dev server and build the static website. Download instructions are available at [gohugo.io](https://gohugo.io/getting-started/quick-start/)
1. Download and install Doxygen (https://www.doxygen.nl/files/doxygen-1.9.2-setup.exe) to the default location
1. In the repo root, run `npm install` to install the required packages
1. Generate the SDK documentation by running the command `npm run sdkgen`
1. Run the dev server with `npm run dev`
1. Optionally, build the static files for offline usage with `npm run static`. The finished site can be found at `./public`

### Updating Geekdocs version - Current v0.29.0
1. Download and extract the latest version of the Geekdocs template  
[https://github.com/thegeeklab/hugo-geekdoc/releases](https://github.com/thegeeklab/hugo-geekdoc/releases)
1. Replace the files in /themes/hugo-geekdoc with the new version
1. Remove the svg favicon option from  
/themes/hugo-geekdoc/layouts/partials/head/favicons.html
1. Ensure that the page author markdown is untouched in themes\hugo-geekdoc\layouts\_default\single.html
1. Check for any breaking changes in previous releases and fix accordingly
1. Update the version listed in this README
1. Push new version

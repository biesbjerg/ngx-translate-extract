# Releasing a new version

The repository is automatically configured so that it releases any tags on master as this version.
To release a new tag do the following:

```
git checkout master
# Commit all your changes 

npm version patch -m "Bumping to %s"
git push
git push --tags

```

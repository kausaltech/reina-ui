#! /bin/sh
env
if [ $ENV == 'dev' ]
then
    yarn dev --hostname 0.0.0.0
else
    yarn start --hostname 0.0.0.0
fi

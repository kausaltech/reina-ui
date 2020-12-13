#! /bin/sh
env
if [ $ENV == 'dev' ]
then
    yarn dev
else
    yarn start
fi

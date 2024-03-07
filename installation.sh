#!/usr/bin/env bash
  set -eux
  set -a
  if [ -f .env ]; then
    source .env
  fi
    # Update packages and install mysql-client.
  apt update && apt install -y default-mysql-client
    # Install nvm and NodeJS.
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  . $HOME/.nvm/nvm.sh
  nvm install 21.6.2
    # Install composer.
  curl -sS https://getcomposer.org/installer | php
  mv composer.phar /usr/local/bin/composer
    # Setup Behat.
  export IPADDRESS=`grep "$HOSTNAME$" /etc/hosts | awk '{print $1}'`
  export MOODLE_BEHAT_WWWROOT="http://$IPADDRESS:8000"
    # Install Moodle CI plugin.
  cd $CI_PROJECT_DIR/.. && rm -rf ci
  composer create-project -n --no-dev --prefer-dist moodlehq/moodle-plugin-ci ci 4.4.0
  export PATH="$(cd ci/bin; pwd):$(cd ci/vendor/bin; pwd):$PATH"
  chmod u+x ci/bin/moodle-plugin-ci
  chmod u+x ci/bin/*
  umask u+x
    # install main plugin
  #moodle-plugin-ci add-plugin edu-sharing/plugin-moodle-edu-sharing
    # Install Moodle (omit the --moodle argument if not needed)
  moodle-plugin-ci install --moodle=$MOODLE_DIR --db-host=mysql --no-init -vvv
    #- moodle-plugin-ci add-config '$CFG->phpunit_prefix = "t_";'
  cd $MOODLE_DIR
  php admin/tool/phpunit/cli/init.php
    # Clone API client into mod_edusharing
  cd mod/edusharing/apiClient
  git clone https://github.com/edu-sharing/php-auth-plugin.git
  cp -a php-auth-plugin/src/. ./src
    #- php -S $IPADDRESS:8000 -t $MOODLE_DIR > /dev/null 2>&1 &
    #- php admin/tool/behat/cli/init.php --add-core-features-to-theme --parallel=1 --optimize-runs=@local_ffhs_exam_toolbox
const fs = require('fs');
let content = fs.readFileSync('src/components/WatchModal.tsx', 'utf8');

// The messed up tail is something like:
/*
                )}
              </div>
            </div>
          </div>
            <Footer />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
*/

const target = `                )}
              </div>
            </div>
          </div>
            <Footer />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}`;

const replacement = `                )}
              </div>
            </div>
            <Footer />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/WatchModal.tsx', content);

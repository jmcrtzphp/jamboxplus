const fs = require('fs');
let content = fs.readFileSync('src/components/WatchModal.tsx', 'utf8');

// Find the start of the end block
const index = content.indexOf('                  <div className="text-sm text-white/40 italic">No recommendations found.</div>');
if (index !== -1) {
  content = content.substring(0, index) + `                  <div className="text-sm text-white/40 italic">No recommendations found.</div>
                )}
              </div>
            </div>
            
            <Footer />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}`;
  fs.writeFileSync('src/components/WatchModal.tsx', content);
}

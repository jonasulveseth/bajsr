if Rails.env.development? || Rails.env.test? || Rails.env.production?
  env_path = Rails.root.join('.env')

  if File.exist?(env_path)
    File.readlines(env_path).each do |line|
      next if line.strip.start_with?('#') || line.strip.empty?

      key, value = line.split('=', 2)
      next if key.blank? || value.nil?

      value = value.strip.gsub(/^['"]|['"]$/, '')
      ENV[key.strip] = value unless ENV.key?(key.strip)
    end
  end
end

# Create a default group
default_group = Group.find_or_create_by(name: "Default Group")

# Create a default user for testing
default_user = User.find_or_create_by(email_address: "test@example.com") do |user|
  user.password = "password123"
  user.password_confirmation = "password123"
end

# Create a membership for the default user
Membership.find_or_create_by(user: default_user, group: default_group)

puts "Created default group: #{default_group.name}"
puts "Created default user: #{default_user.email_address}"
puts "Created membership for user in group"
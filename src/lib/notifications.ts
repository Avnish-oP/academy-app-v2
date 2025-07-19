import User from '../models/User';
import Notification from '../models/Notification';

export async function createUpdateNotification(
  updateData: {
    _id: string;
    title: string;
    content: string;
    targetAudience: {
      classes: string[];
      sendToAll: boolean;
    };
    mentions: {
      users: string[];
      usernames: string[];
    };
    author: string;
  }
) {
  try {
    // Extract mentions from content using @ symbol
    const mentionPattern = /@(\w+)/g;
    const mentionsInContent = [...updateData.content.matchAll(mentionPattern)]
      .map(match => match[1]);

    // Combine mentions from the mentions field and content
    const allMentionedUsernames = [
      ...updateData.mentions.usernames,
      ...mentionsInContent
    ].filter((username, index, self) => self.indexOf(username) === index); // Remove duplicates

    // Find mentioned users
    const mentionedUsers = await User.find({
      username: { $in: allMentionedUsernames }
    });

    // Create notification for mentions
    if (mentionedUsers.length > 0) {
      await Notification.create({
        title: `You were mentioned in: ${updateData.title}`,
        message: `${updateData.content.substring(0, 100)}${updateData.content.length > 100 ? '...' : ''}`,
        type: 'info',
        priority: 'medium',
        recipients: {
          users: mentionedUsers.map(user => user._id),
          roles: [],
          courses: [],
          sendToAll: false
        },
        sender: updateData.author,
        channels: {
          push: true,
          email: false,
          sms: false,
          inApp: true
        },
        isActive: true
      });
    }

    // Create general notification for class/all students
    const recipientConfig: any = {
      users: updateData.mentions.users || [],
      roles: [],
      courses: [],
      sendToAll: updateData.targetAudience.sendToAll
    };

    // If targeting specific classes, add them
    if (!updateData.targetAudience.sendToAll && updateData.targetAudience.classes.length > 0) {
      // For now, we'll use roles since we don't have a direct class targeting in the notification model
      // In a real implementation, you might want to expand the notification model to support class targeting
      recipientConfig.roles = ['student'];
    }

    await Notification.create({
      title: updateData.title,
      message: updateData.content,
      type: 'announcement',
      priority: 'medium',
      recipients: recipientConfig,
      sender: updateData.author,
      channels: {
        push: true,
        email: false,
        sms: false,
        inApp: true
      },
      isActive: true
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating update notification:', error);
    return { success: false, error };
  }
}

export function extractMentions(content: string): string[] {
  const mentionPattern = /@(\w+)/g;
  return [...content.matchAll(mentionPattern)].map(match => match[1]);
}

export function formatContentWithMentions(content: string): string {
  return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
}
